import { Router } from "express";
import { AuthController } from "./auth.controller";
import validate from "src/validators/validate";
import { RegisterSchema, LoginSchema } from "src/validators/auth.validator";
import passport from "passport";
import { ENV } from "src/constants/dotenv";
import { authLimiter, passwordResetLimiter } from "src/utils/rate-limit/rate-limiters";

const router = Router();
const authController = new AuthController();

// 1. Register
router.post("/register", authLimiter, validate(RegisterSchema), authController.register);

// 2. Login
router.post(
  "/login",
  authLimiter,
  validate(LoginSchema),
  passport.authenticate("local", { session: false }),
  authController.login
);

// 3. Logout
router.post("/logout", authController.logout);

// 4. Current User (protected)
router.get(
  "/me",
  passport.authenticate("jwt", { session: false }),
  authController.me
);

// 5. Verification & Password Reset
router.get("/verify-email", authController.verifyEmail);
router.post("/forgot-password", passwordResetLimiter, authController.forgotPassword);
router.post("/reset-password", passwordResetLimiter, authController.resetPassword);

// ── Google OAuth ───────────────────────────────────────────────────────────

if (ENV.GOOGLE_CLIENT_ID && ENV.GOOGLE_CLIENT_SECRET) {
  router.get(
    "/google",
    authLimiter,
    passport.authenticate("google", {
      session: false,
      scope: ["profile", "email"],
    })
  );

  router.get(
    "/google/callback",
    authLimiter,
    passport.authenticate("google", {
      session: false,
      failureRedirect: "/login",
    }),
    authController.oauthCallback
  );
}

// ── GitHub OAuth ───────────────────────────────────────────────────────────

if (ENV.GITHUB_CLIENT_ID && ENV.GITHUB_CLIENT_SECRET) {
  router.get(
    "/github",
    authLimiter,
    passport.authenticate("github", {
      session: false,
      scope: ["user:email"],
    })
  );

  router.get(
    "/github/callback",
    authLimiter,
    passport.authenticate("github", {
      session: false,
      failureRedirect: "/login",
    }),
    authController.oauthCallback
  );
}

export default router;
