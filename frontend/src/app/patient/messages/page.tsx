"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getMessageableDoctors, MessageableDoctor } from "@/lib/appointments";
import ConversationList from "@/app/patient/messages/_components/ConversationList";
import ChatThreadHeader from "@/app/patient/messages/_components/ChatThreadHeader";
import MessageBubble from "@/app/patient/messages/_components/MessageBubble";
import ChatComposer from "@/app/patient/messages/_components/ChatComposer";
import { ChatMessage, buildSeedConversation } from "@/app/patient/messages/_components/types";

export default function MessagesPage() {
  const [doctors, setDoctors] = useState<MessageableDoctor[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [threads, setThreads] = useState<Record<string, ChatMessage[]>>({});
  const [mobileView, setMobileView] = useState<"list" | "thread">("list");

  useEffect(() => {
    const messageable = getMessageableDoctors();
    setDoctors(messageable);
    if (messageable.length > 0) {
      setSelected(messageable[0].doctorName);
      setThreads({ [messageable[0].doctorName]: buildSeedConversation() });
    }
  }, []);

  function handleSelect(doctorName: string) {
    setSelected(doctorName);
    setThreads((prev) => (prev[doctorName] ? prev : { ...prev, [doctorName]: buildSeedConversation() }));
    setMobileView("thread");
  }

  function handleSend(text: string) {
    if (!selected) return;
    const newMessage: ChatMessage = {
      id: crypto.randomUUID(),
      sender: "patient",
      text,
      time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
    };
    setThreads((prev) => ({
      ...prev,
      [selected]: [...(prev[selected] ?? []), newMessage],
    }));
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

  const activeDoctor = doctors.find((d) => d.doctorName === selected) ?? doctors[0];
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
