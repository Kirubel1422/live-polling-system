import { Router } from "express";
import { AuthController } from "./auth.controller";
import validate from "src/validators/validate";
import { RegisterSchema, LoginSchema } from "src/validators/auth.validator";
import passport from "passport";
import { ENV } from "src/constants/dotenv";

const router = Router();
const authController = new AuthController();

// 1. Register
router.post("/register", validate(RegisterSchema), authController.register);

// 2. Login
router.post(
  "/login",
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
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

// ── Google OAuth ───────────────────────────────────────────────────────────

if (ENV.GOOGLE_CLIENT_ID && ENV.GOOGLE_CLIENT_SECRET) {
  router.get(
    "/google",
    passport.authenticate("google", {
      session: false,
      scope: ["profile", "email"],
    })
  );

  router.get(
    "/google/callback",
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
    passport.authenticate("github", {
      session: false,
      scope: ["user:email"],
    })
  );

  router.get(
    "/github/callback",
    passport.authenticate("github", {
      session: false,
      failureRedirect: "/login",
    }),
    authController.oauthCallback
  );
}

export default router;
