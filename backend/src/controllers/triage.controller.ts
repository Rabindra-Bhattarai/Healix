import { Request, Response } from "express";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import Department from "../models/Department";
import { asyncHandler } from "../utils/asyncHandler";

interface IncomingMessage {
  role: "user" | "ai";
  text: string;
}

let client: GoogleGenerativeAI | null = null;

function getClient(): GoogleGenerativeAI | null {
  if (!process.env.GEMINI_API_KEY) return null;
  if (!client) client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  return client;
}

export const triageChat = asyncHandler(async (req: Request, res: Response) => {
  const { messages } = req.body ?? {};
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ message: "messages is required" });
  }

  const genAI = getClient();
  if (!genAI) {
    return res.status(500).json({ message: "AI triage is not configured on the server" });
  }

  const departments = await Department.find();
  const departmentList = departments
    .map((d) => `- ${d.name} (slug: "${d.slug}"): ${d.description}`)
    .join("\n");

  const systemInstruction = `You are Healix's AI symptom triage assistant. Have a short, empathetic conversation with a patient about their symptoms, then recommend ONE of the following departments by its exact slug:

${departmentList}

Rules:
- Ask at most 1-2 short clarifying questions if the description is vague.
- Once reasonably confident, set recommendedDepartmentSlug to the exact slug of the best-matching department above.
- Never invent a department that isn't in the list above, and never set the slug until you are reasonably confident.
- If symptoms genuinely don't match any department in the list, leave recommendedDepartmentSlug null. In that case, do NOT name or suggest any other specialty, department, or type of doctor that isn't in the list above (e.g. never say "primary care physician", "orthopedic specialist", "general practitioner", etc.) - we do not have those departments yet. Simply and kindly explain that we don't currently have a specialized department for these symptoms, and suggest they check back as more departments are added, or contact the hospital directly for guidance.
- Keep replies brief (2-4 sentences), warm, and non-alarming. You are not a doctor and must not diagnose.`;

  const model = genAI.getGenerativeModel({
    model: "gemini-flash-latest",
    systemInstruction,
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: SchemaType.OBJECT,
        properties: {
          reply: { type: SchemaType.STRING },
          recommendedDepartmentSlug: { type: SchemaType.STRING, nullable: true },
        },
        required: ["reply"],
      },
    },
  });

  const typedMessages = messages as IncomingMessage[];
  const history = typedMessages.slice(0, -1).map((m) => ({
    role: m.role === "user" ? "user" : "model",
    parts: [{ text: m.text }],
  }));
  const latest = typedMessages[typedMessages.length - 1];

  const chat = model.startChat({ history });

  let result;
  try {
    result = await chat.sendMessage(latest.text);
  } catch (err) {
    const isTransient = err instanceof Error && /503|overloaded|high demand/i.test(err.message);
    if (isTransient) {
      // Gemini free-tier models occasionally return 503 under load; one quick retry usually clears it.
      await new Promise((resolve) => setTimeout(resolve, 800));
      try {
        result = await chat.sendMessage(latest.text);
      } catch (retryErr) {
        console.error("[triage] Gemini request failed after retry", retryErr);
        return res.status(503).json({
          message: "Our AI assistant is temporarily busy. Please try again in a moment.",
        });
      }
    } else {
      console.error("[triage] Gemini request failed", err);
      return res.status(503).json({
        message: "Our AI assistant is temporarily unavailable. Please try again in a moment.",
      });
    }
  }

  const parsed = JSON.parse(result.response.text()) as {
    reply: string;
    recommendedDepartmentSlug?: string | null;
  };

  const recommendedDepartmentSlug = departments.find(
    (d) => d.slug === parsed.recommendedDepartmentSlug
  )?.slug;

  res.json({ reply: parsed.reply, recommendedDepartmentSlug });
});
