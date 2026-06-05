import { Router } from "express";
import { UserController } from "./user.controller";
import passport from "passport";
import multer from "multer";
import { userMutationLimiter, authLimiter } from "src/utils/rate-limit/rate-limiters";

const router = Router();
const userController = new UserController();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Require auth for all user routes
router.use(passport.authenticate("jwt", { session: false }));

router.put("/profile", userMutationLimiter, userController.updateProfile);
router.put("/password", authLimiter, userController.updatePassword);
router.put("/notifications", userMutationLimiter, userController.updateEmailNotifications);
router.post("/avatar", userMutationLimiter, upload.single("avatar"), userController.uploadAvatar);

export default router;
