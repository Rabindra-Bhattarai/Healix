import { ChatMessage } from "@/app/patient/messages/_components/types";

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

      {message.attachment && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-surface-container-lowest border border-outline-variant/20">
          <span className="material-symbols-outlined text-error text-[28px]">picture_as_pdf</span>
          <div className="min-w-0">
            <p className="font-label-sm text-label-sm font-semibold text-on-surface truncate">
              {message.attachment.name}
            </p>
            <p className="font-label-sm text-label-sm text-on-surface-variant">
              {message.attachment.meta}
            </p>
          </div>
          <button
            aria-label="Download attachment"
            className="ml-2 text-on-surface-variant hover:text-primary"
          >
            <span className="material-symbols-outlined text-[20px]">download</span>
          </button>
        </div>
      )}

      <span className="font-label-sm text-label-sm text-on-surface-variant/60 px-1">
        {message.time}
      </span>
    </div>
  );
}
