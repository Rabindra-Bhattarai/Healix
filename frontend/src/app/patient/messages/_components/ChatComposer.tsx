"use client";

import { FormEvent, useState } from "react";

export default function ChatComposer({ onSend }: { onSend: (text: string) => void }) {
  const [value, setValue] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!value.trim()) return;
    onSend(value.trim());
    setValue("");
  }

  return (
    <div className="border-t border-outline-variant/20 p-3 sm:p-4">
      <form onSubmit={handleSubmit} className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          className="text-on-surface-variant hover:text-primary hidden sm:inline-flex"
          aria-label="Attach file"
        >
          <span className="material-symbols-outlined">add_circle</span>
        </button>
        <button
          type="button"
          className="text-on-surface-variant hover:text-primary hidden sm:inline-flex"
          aria-label="Add emoji"
        >
          <span className="material-symbols-outlined">mood</span>
        </button>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 h-11 px-4 rounded-full bg-surface-container-low font-body-md text-body-md outline-none focus:ring-1 focus:ring-primary/40 min-w-0"
        />
        <button
          type="button"
          className="text-on-surface-variant hover:text-primary hidden sm:inline-flex"
          aria-label="Voice message"
        >
          <span className="material-symbols-outlined">mic</span>
        </button>
        <button
          type="submit"
          aria-label="Send"
          className="size-11 rounded-full bg-primary text-on-primary flex items-center justify-center shrink-0 hover:opacity-90 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-[20px]">send</span>
        </button>
      </form>
      <p className="text-center font-label-sm text-label-sm text-on-surface-variant/60 mt-2">
        Messages are encrypted and clinically secure.
      </p>
    </div>
  );
}
