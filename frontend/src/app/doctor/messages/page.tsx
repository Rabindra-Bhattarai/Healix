"use client";

import { useEffect, useState } from "react";
import { DoctorConversation, listMyConversations, getMessages, sendMessage } from "@/lib/doctorConversations";
import { ChatMessage } from "@/lib/conversations";
import PatientConversationList from "@/app/doctor/messages/_components/PatientConversationList";
import PatientThreadHeader from "@/app/doctor/messages/_components/PatientThreadHeader";
import MessageBubble from "@/app/patient/messages/_components/MessageBubble";
import ChatComposer from "@/app/patient/messages/_components/ChatComposer";

export default function DoctorMessagesPage() {
  const [conversations, setConversations] = useState<DoctorConversation[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [threads, setThreads] = useState<Record<string, ChatMessage[]>>({});
  const [mobileView, setMobileView] = useState<"list" | "thread">("list");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listMyConversations()
      .then((list) => {
        setConversations(list);
        if (list.length > 0) {
          void openThread(list[0].conversationId);
        }
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function openThread(conversationId: string) {
    setSelected(conversationId);
    if (!threads[conversationId]) {
      const messages = await getMessages(conversationId);
      setThreads((prev) => ({ ...prev, [conversationId]: messages }));
    }
  }

  function handleSelect(conversationId: string) {
    void openThread(conversationId);
    setMobileView("thread");
  }

  async function handleSend(text: string) {
    if (!selected) return;
    const message = await sendMessage(selected, text);
    setThreads((prev) => ({
      ...prev,
      [selected]: [...(prev[selected] ?? []), message],
    }));
  }

  if (loading) {
    return null;
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 max-w-2xl mx-auto w-full text-center">
        <div className="w-32 h-32 bg-primary/5 rounded-full flex items-center justify-center mb-8">
          <span className="material-symbols-outlined text-primary text-5xl">chat</span>
        </div>
        <h3 className="font-h3 text-h3 text-on-surface mb-3">No conversations yet</h3>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">
          A conversation appears here once a patient with a booked appointment messages you.
        </p>
      </div>
    );
  }

  const activeConversation =
    conversations.find((c) => c.conversationId === selected) ?? conversations[0];
  const messages = (selected && threads[selected]) || [];

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-surface-container-lowest rounded-xl border border-outline-variant/20 overflow-hidden">
      <PatientConversationList
        conversations={conversations}
        selected={selected}
        onSelect={handleSelect}
        previewText={messages[messages.length - 1]?.text ?? ""}
        visible={mobileView === "list"}
      />

      <div className={`flex-1 flex-col ${mobileView === "thread" ? "flex" : "hidden"} md:flex`}>
        <PatientThreadHeader
          patientName={activeConversation.patientName}
          onBack={() => setMobileView("list")}
        />

        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 flex flex-col gap-4">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} viewerRole="doctor" />
          ))}
        </div>

        <ChatComposer onSend={handleSend} />
      </div>
    </div>
  );
}
