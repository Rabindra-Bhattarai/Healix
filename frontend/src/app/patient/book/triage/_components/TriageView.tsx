"use client";

import { useState } from "react";
import ChatBubble, { ChatMessage } from "@/app/patient/book/triage/_components/ChatBubble";
import ChatInput from "@/app/patient/book/triage/_components/ChatInput";
import { matchDepartmentFromSymptoms } from "@/lib/departments";

const GREETING: ChatMessage = {
  role: "ai",
  text: "Hi, I'm Healix's AI assistant. Describe your symptoms and I'll help direct you to the right department.",
};

const NO_MATCH_REPLY: ChatMessage = {
  role: "ai",
  text: "I couldn't quite match that to a department. Could you describe your symptoms in a bit more detail?",
};

export default function TriageView() {
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);

  function handleSend(text: string) {
    const department = matchDepartmentFromSymptoms(text);

    const reply: ChatMessage = department
      ? {
          role: "ai",
          text: `Based on what you've described, I'd recommend visiting ${department.name}. You should book this department.`,
          recommendedDepartment: department,
        }
      : NO_MATCH_REPLY;

    setMessages((prev) => [...prev, { role: "user", text }, reply]);
  }

  return (
    <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full relative">
      <div className="flex-1 flex flex-col gap-6 pb-40">
        {messages.map((message, i) => (
          <ChatBubble key={i} message={message} />
        ))}
      </div>
      <ChatInput onSend={handleSend} />
    </div>
  );
}
