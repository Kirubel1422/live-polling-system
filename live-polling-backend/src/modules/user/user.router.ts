import { Router } from "express";
import { UserController } from "./user.controller";
import passport from "passport";
import multer from "multer";

const router = Router();
const userController = new UserController();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Require auth for all user routes
router.use(passport.authenticate("jwt", { session: false }));

router.put("/profile", userController.updateProfile);
router.put("/password", userController.updatePassword);
router.put("/notifications", userController.updateEmailNotifications);
router.post("/avatar", upload.single("avatar"), userController.uploadAvatar);

export default router;
