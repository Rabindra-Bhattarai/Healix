import { api } from "@/lib/api";
import { Session } from "@/lib/auth";

export function loginWithGoogle(credential: string): Promise<Session> {
  return api.post<Session>("/auth/google", { credential });
}

export function loginWithFacebook(accessToken: string): Promise<Session> {
  return api.post<Session>("/auth/facebook", { accessToken });
}
