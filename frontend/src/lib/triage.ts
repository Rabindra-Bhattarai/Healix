import { api } from "@/lib/api";

export interface TriageApiMessage {
  role: "user" | "ai";
  text: string;
}

export interface TriageResponse {
  reply: string;
  recommendedDepartmentSlug?: string;
}

export function sendTriageMessage(messages: TriageApiMessage[]): Promise<TriageResponse> {
  return api.post<TriageResponse>("/triage/chat", { messages });
}
