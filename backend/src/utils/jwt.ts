import jwt from "jsonwebtoken";
import { UserRole } from "../models/User";

export interface TokenPayload {
  id: string;
  role: UserRole;
}

export function signToken(payload: TokenPayload): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set");

  return jwt.sign(payload, secret, {
    expiresIn: (process.env.JWT_EXPIRES_IN ?? "7d") as jwt.SignOptions["expiresIn"],
  });
}

export function verifyToken(token: string): TokenPayload {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set");

  return jwt.verify(token, secret) as TokenPayload;
}
