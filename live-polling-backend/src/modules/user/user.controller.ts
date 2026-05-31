import { Request, Response, NextFunction } from "express";
import { UserService } from "./user.service";
import { ApiResp } from "src/utils/api/api.response";
import { UserEntity } from "src/entities/User.entity";

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
    this.updateProfile = this.updateProfile.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
    this.uploadAvatar = this.uploadAvatar.bind(this);
    this.updateEmailNotifications = this.updateEmailNotifications.bind(this);
  }

  async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user as Partial<UserEntity>;
      const updatedUser = await this.userService.updateProfile(user.id!, req.body);
      res.status(200).json(new ApiResp("Profile updated successfully", 200, true, { user: updatedUser }));
    } catch (error) {
      next(error);
    }
  }

  async updatePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user as Partial<UserEntity>;
      const updatedUser = await this.userService.updatePassword(user.id!, req.body);
      res.status(200).json(new ApiResp("Password updated successfully", 200, true, { user: updatedUser }));
    } catch (error) {
      next(error);
    }
  }

  async uploadAvatar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user as Partial<UserEntity>;
      if (!req.file) {
        res.status(400).json(new ApiResp("No file provided", 400, false));
        return;
      }
      const updatedUser = await this.userService.uploadAvatar(user.id!, req.file.buffer);
      res.status(200).json(new ApiResp("Avatar uploaded successfully", 200, true, { user: updatedUser }));
    } catch (error) {
      next(error);
    }
  }

  async updateEmailNotifications(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user as Partial<UserEntity>;
      const updatedUser = await this.userService.updateEmailNotifications(user.id!, req.body.enabled);
      res.status(200).json(new ApiResp("Notifications updated successfully", 200, true, { user: updatedUser }));
    } catch (error) {
      next(error);
    }
  }
}
