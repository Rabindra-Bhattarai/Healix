import Link from "next/link";
import { Department } from "@/lib/departments";

export interface ChatMessage {
  role: "ai" | "user";
  text: string;
  recommendedDepartment?: Department;
}

export default function ChatBubble({ message }: { message: ChatMessage }) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-2xl bg-primary text-on-primary rounded-2xl rounded-tr-sm px-5 py-3">
          <p className="font-body-md text-body-md">{message.text}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-4 max-w-2xl">
      <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center shrink-0">
        <span className="material-symbols-outlined text-on-primary text-[20px]">
          medical_services
        </span>
      </div>
      <div className="flex flex-col gap-3 mt-1">
        <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl rounded-tl-sm px-5 py-3">
          <p className="font-body-md text-body-md text-on-surface">{message.text}</p>
        </div>
        {message.recommendedDepartment && (
          <Link
            href={`/patient/book/doctor?department=${message.recommendedDepartment.slug}`}
            className="self-start bg-primary text-on-primary px-5 py-2.5 rounded-xl font-body-md font-semibold flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">
              {message.recommendedDepartment.icon}
            </span>
            Book {message.recommendedDepartment.name}
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        )}
      </div>
    </div>
  );
}
