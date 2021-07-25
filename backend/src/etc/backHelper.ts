import env from "../loaders/env";
import jwt from "jsonwebtoken";

export function createToken(user: { id: string }): string {
  user = Object.assign({}, user);
  const token = jwt.sign(user, env.JWT_SECRET, {
    // expiresIn: seconds, // if you want to put a expire date
  });

  return token;
}

export function decodeToken(
  token: string
): string | { id: string; iat: number; exp: number } {
  const decoded = jwt.verify(token, env.JWT_SECRET);
  return decoded as { id: string; iat: number; exp: number };
}
