import { CorsOptions } from "cors";
import { ENV } from "src/constants/dotenv";

/**
 * Build CORS options from the validated ENV.CLIENT_URL allowlist.
 * In production, only listed origins are allowed.
 * In dev/test, we also accept the allowlist but keep credentials true.
 */
export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (server-to-server, curl, health checks)
    if (!origin) {
      return callback(null, true);
    }
    if (ENV.CLIENT_URL.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
    "X-Request-Id",
  ],
};

/**
 * Socket.IO CORS options — mirrors the Express CORS allowlist.
 */
export const socketCorsOptions = {
  origin: ENV.CLIENT_URL,
  methods: ["GET", "POST"],
  credentials: true,
};
