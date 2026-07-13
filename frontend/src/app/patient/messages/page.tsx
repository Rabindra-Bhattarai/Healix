"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getMessageableDoctors, MessageableDoctor } from "@/lib/appointments";
import { ChatMessage, startConversation, getMessages, sendMessage } from "@/lib/conversations";
import ConversationList from "@/app/patient/messages/_components/ConversationList";
import ChatThreadHeader from "@/app/patient/messages/_components/ChatThreadHeader";
import MessageBubble from "@/app/patient/messages/_components/MessageBubble";
import ChatComposer from "@/app/patient/messages/_components/ChatComposer";

export default function MessagesPage() {
  const [doctors, setDoctors] = useState<MessageableDoctor[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [conversationIds, setConversationIds] = useState<Record<string, string>>({});
  const [threads, setThreads] = useState<Record<string, ChatMessage[]>>({});
  const [mobileView, setMobileView] = useState<"list" | "thread">("list");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMessageableDoctors()
      .then((messageable) => {
        setDoctors(messageable);
        if (messageable.length > 0) {
          void openThread(messageable[0].doctorId);
        }
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function openThread(doctorId: string) {
    setSelected(doctorId);
    const conversationId = conversationIds[doctorId] ?? (await startConversation(doctorId));
    setConversationIds((prev) => ({ ...prev, [doctorId]: conversationId }));
    if (!threads[doctorId]) {
      const messages = await getMessages(conversationId);
      setThreads((prev) => ({ ...prev, [doctorId]: messages }));
    }
  }

  function handleSelect(doctorId: string) {
    void openThread(doctorId);
    setMobileView("thread");
  }

  async function handleSend(text: string) {
    if (!selected) return;
    const conversationId = conversationIds[selected];
    if (!conversationId) return;

    const message = await sendMessage(conversationId, text);
    setThreads((prev) => ({
      ...prev,
      [selected]: [...(prev[selected] ?? []), message],
    }));
  }

  if (loading) {
    return null;
  }

  if (doctors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 max-w-2xl mx-auto w-full text-center">
        <div className="w-32 h-32 bg-primary/5 rounded-full flex items-center justify-center mb-8">
          <span className="material-symbols-outlined text-primary text-5xl">chat</span>
        </div>
        <h3 className="font-h3 text-h3 text-on-surface mb-3">No conversations yet</h3>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-sm mb-8">
          You can only message doctors you have an appointment with. Book one to start a
          conversation.
        </p>
        <Link
          href="/patient/book"
          className="bg-primary text-on-primary px-6 py-2.5 rounded-xl font-label-sm text-label-sm hover:opacity-90 active:scale-95 transition-all shadow-sm"
        >
          Book Appointment
        </Link>
      </div>
    );
  }

  const activeDoctor = doctors.find((d) => d.doctorId === selected) ?? doctors[0];
  const messages = (selected && threads[selected]) || [];
  const lastMessage = messages[messages.length - 1];

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-surface-container-lowest rounded-xl border border-outline-variant/20 overflow-hidden">
      <ConversationList
        doctors={doctors}
        selected={selected}
        onSelect={handleSelect}
        previewText={lastMessage?.text ?? ""}
        visible={mobileView === "list"}
      />

      <div className={`flex-1 flex-col ${mobileView === "thread" ? "flex" : "hidden"} md:flex`}>
        <ChatThreadHeader
          doctorName={activeDoctor.doctorName}
          specialty={activeDoctor.specialty}
          onBack={() => setMobileView("list")}
        />

        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 flex flex-col gap-4">
          <div className="text-center">
            <span className="font-label-sm text-label-sm text-on-surface-variant/60 uppercase tracking-wide">
              Today
            </span>
          </div>
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
        </div>

        <ChatComposer onSend={handleSend} />
      </div>
    </div>
  );
}
