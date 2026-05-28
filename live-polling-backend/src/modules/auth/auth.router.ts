import { Router } from "express";
import { AuthController } from "./auth.controller";
import validate from "src/validators/validate";
import { RegisterSchema, LoginSchema } from "src/validators/auth.validator";
import passport from "passport";

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

export default router;
