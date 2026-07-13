"use client";

import { useState } from "react";
import ChatBubble, { ChatMessage } from "@/app/patient/book/triage/_components/ChatBubble";
import ChatInput from "@/app/patient/book/triage/_components/ChatInput";
import { getDepartment } from "@/lib/departments";
import { sendTriageMessage } from "@/lib/triage";
import { ApiError } from "@/lib/api";

const GREETING: ChatMessage = {
  role: "ai",
  text: "Hi, I'm Healix's AI assistant. Describe your symptoms and I'll help direct you to the right department.",
};

export default function TriageView() {
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [sending, setSending] = useState(false);

  async function handleSend(text: string) {
    const userMessage: ChatMessage = { role: "user", text };
    const history = [...messages, userMessage];
    setMessages(history);
    setSending(true);

    try {
      // Drop the static greeting - it's UI copy, not a real conversation turn.
      const apiMessages = history
        .slice(1)
        .map((m) => ({ role: m.role, text: m.text }));

      const { reply, recommendedDepartmentSlug } = await sendTriageMessage(apiMessages);
      const recommendedDepartment = recommendedDepartmentSlug
        ? await getDepartment(recommendedDepartmentSlug)
        : undefined;

      setMessages((prev) => [...prev, { role: "ai", text: reply, recommendedDepartment }]);
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Sorry, I'm having trouble responding right now. Please try again.";
      setMessages((prev) => [...prev, { role: "ai", text: message }]);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full relative">
      <div className="flex-1 flex flex-col gap-6 pb-40">
        {messages.map((message, i) => (
          <ChatBubble key={i} message={message} />
        ))}
        {sending && (
          <div className="flex gap-4 max-w-2xl">
            <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-on-primary text-[20px]">
                medical_services
              </span>
            </div>
            <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl rounded-tl-sm px-5 py-3 flex items-center gap-1.5 mt-1">
              <span className="w-1.5 h-1.5 bg-on-surface-variant/50 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1.5 h-1.5 bg-on-surface-variant/50 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-1.5 bg-on-surface-variant/50 rounded-full animate-bounce" />
            </div>
          </div>
        )}
      </div>
      <ChatInput onSend={handleSend} disabled={sending} />
    </div>
  );
}
