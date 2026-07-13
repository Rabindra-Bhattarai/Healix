export type UserRole = "patient" | "doctor" | "admin";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatarUrl?: string;
  bloodType?: string;
  allergies?: string;
  chronicConditions?: string;
  address?: string;
  dob?: string;
  gender?: string;
  twoFactorEnabled?: boolean;
}

export interface Session {
  token: string;
  user: SessionUser;
}

const SESSION_KEY = "healix.session";

export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
}

export function saveSession(session: Session) {
  if (typeof window === "undefined") return;
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
}

export function roleHomePath(role: UserRole) {
  if (role === "doctor") return "/doctor";
  if (role === "admin") return "/admin";
  return "/patient";
}
