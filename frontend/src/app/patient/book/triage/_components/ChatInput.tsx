"use client";

import { FormEvent, useState } from "react";

const SUGGESTED_SYMPTOMS = ["Headache", "Fever", "Chest pain", "Skin rash", "Joint pain"];

export default function ChatInput({
  onSend,
}: {
  onSend: (text: string) => void;
}) {
  const [value, setValue] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!value.trim()) return;
    onSend(value.trim());
    setValue("");
  }

  return (
    <div className="fixed bottom-0 left-sidebar_width right-0 bg-background border-t border-outline-variant/20 p-grid_margin">
      <div className="max-w-5xl mx-auto flex flex-col gap-3">
        <div className="flex gap-2 flex-wrap">
          {SUGGESTED_SYMPTOMS.map((symptom) => (
            <button
              key={symptom}
              onClick={() => onSend(symptom)}
              className="px-3 py-1.5 rounded-full border border-outline-variant text-on-surface-variant font-label-sm text-label-sm hover:border-primary hover:text-primary transition-colors"
            >
              {symptom}
            </button>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Describe your symptoms..."
            className="flex-1 h-12 px-4 rounded-full border border-outline-variant bg-surface-container-lowest font-body-md text-body-md outline-none focus:border-primary"
          />
          <button
            type="submit"
            aria-label="Send"
            className="size-12 rounded-full bg-primary text-on-primary flex items-center justify-center shrink-0 hover:opacity-90 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_upward</span>
          </button>
        </form>
      </div>
    </div>
  );
}
