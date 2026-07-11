import Link from "next/link";

export default function MessagesFab() {
  return (
    <Link
      href="/patient/messages"
      className="fixed bottom-6 right-6 sm:bottom-10 sm:right-10 w-16 h-16 sm:w-20 sm:h-20 bg-primary text-on-primary rounded-full shadow-[0_15px_40px_-10px_rgba(87,78,177,0.6)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 group"
    >
      <span className="material-symbols-outlined text-3xl sm:text-4xl group-hover:rotate-12 transition-transform">
        chat_bubble
      </span>
      <span className="absolute -top-1 -right-1 w-6 h-6 bg-secondary text-white text-[11px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-lg">
        2
      </span>
    </Link>
  );
}