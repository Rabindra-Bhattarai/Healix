"use client";

import { useState } from "react";
import { DoctorConversation } from "@/lib/doctorConversations";

export default function PatientConversationList({
  conversations,
  selected,
  onSelect,
  previewText,
  visible = true,
}: {
  conversations: DoctorConversation[];
  selected: string | null;
  onSelect: (conversationId: string) => void;
  previewText: string;
  visible?: boolean;
}) {
  const [search, setSearch] = useState("");

  const visibleConversations = conversations.filter((c) =>
    c.patientName.toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    <div
      className={`${visible ? "flex" : "hidden"} md:flex w-full md:w-80 shrink-0 border-r border-outline-variant/20 flex-col bg-surface-container-lowest rounded-l-xl`}
    >
      <div className="p-4 border-b border-outline-variant/10">
        <h2 className="font-h3 text-h3 text-primary mb-3">Messages</h2>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant">
            search
          </span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search conversations..."
            className="w-full h-9 pl-9 pr-3 rounded-full bg-surface-container-low text-body-md font-body-md outline-none focus:ring-1 focus:ring-primary/40"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {visibleConversations.length === 0 ? (
          <p className="px-4 py-6 text-center font-label-sm text-label-sm text-on-surface-variant">
            No conversations match &quot;{search}&quot;.
          </p>
        ) : (
          visibleConversations.map((conversation) => {
            const active = conversation.conversationId === selected;
            return (
              <button
                key={conversation.conversationId}
                onClick={() => onSelect(conversation.conversationId)}
                className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors ${
                  active ? "bg-primary/10 border-l-2 border-primary" : "hover:bg-surface-container-low"
                }`}
              >
                <div className="size-10 rounded-full bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">person</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-body-md text-body-md font-semibold text-on-surface truncate">
                    {conversation.patientName}
                  </p>
                  <p className="font-label-sm text-label-sm text-on-surface-variant truncate mt-0.5">
                    {previewText}
                  </p>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
