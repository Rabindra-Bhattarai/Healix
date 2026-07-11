export interface BookingDraft {
  doctorSlug?: string;
  date?: string;
  dateLabel?: string;
  time?: string;
}

const STORAGE_KEY = "healix.bookingDraft";

export function getBookingDraft(): BookingDraft {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as BookingDraft) : {};
  } catch {
    return {};
  }
}

export function saveBookingDraft(patch: Partial<BookingDraft>): BookingDraft {
  const next = { ...getBookingDraft(), ...patch };
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }
  return next;
}

export function clearBookingDraft(): void {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(STORAGE_KEY);
  }
}
