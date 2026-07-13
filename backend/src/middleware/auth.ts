import { Request, Response, NextFunction } from "express";
import { verifyToken, TokenPayload } from "../utils/jwt";
import { UserRole } from "../models/User";

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export function protect(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    req.user = verifyToken(header.slice("Bearer ".length));
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

export function authorize(...roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Not authorized for this action" });
    }
    next();
  };
}
