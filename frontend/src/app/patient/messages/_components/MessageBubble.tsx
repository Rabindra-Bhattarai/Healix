import { ChatMessage } from "@/lib/conversations";

export default function MessageBubble({ message }: { message: ChatMessage }) {
  const isPatient = message.sender === "patient";

  return (
    <div className={`flex flex-col gap-1 max-w-md ${isPatient ? "self-end items-end" : "self-start items-start"}`}>
      <div
        className={`px-5 py-3 rounded-2xl ${
          isPatient
            ? "bg-primary text-on-primary rounded-tr-sm"
            : "bg-surface-container-low text-on-surface rounded-tl-sm"
        }`}
      >
        <p className="font-body-md text-body-md">{message.text}</p>
      </div>

      <span className="font-label-sm text-label-sm text-on-surface-variant/60 px-1">
        {message.time}
      </span>
    </div>
  );
}
