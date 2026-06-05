import { CookieOptions, Request } from "express";
import { ENV } from "src/constants/dotenv";

export const getCookieOptions = (req: Request): CookieOptions => {
  const isLocalhost = req.hostname === "localhost" || req.hostname === "127.0.0.1";
  const isSecure = ENV.NODE_ENV === "production" && !isLocalhost;

  return {
    httpOnly: true,
    secure: isSecure,
    sameSite: isSecure ? "strict" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    domain: ENV.APP_COOKIE_DOMAIN,
    path: "/",
  };
};
