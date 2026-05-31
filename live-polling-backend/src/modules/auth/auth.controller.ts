import { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service";
import { RegisterDto } from "src/validators/auth.validator";
import { ApiResp } from "src/utils/api/api.response";
import { UserEntity } from "src/entities/User.entity";
import { ENV } from "src/constants/dotenv";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.me = this.me.bind(this);
    this.oauthCallback = this.oauthCallback.bind(this);
    this.verifyEmail = this.verifyEmail.bind(this);
    this.forgotPassword = this.forgotPassword.bind(this);
    this.resetPassword = this.resetPassword.bind(this);
  }

  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = req.body as RegisterDto;
      const user = await this.authService.register(dto);
      const token = this.authService.generateToken(user);
      
      res.cookie("jwt", token, {
        httpOnly: true,
        secure: ENV.NODE_ENV === "production",
        sameSite: ENV.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.status(201).json(new ApiResp("User registered successfully", 201, true, { user, token }));
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user as Partial<UserEntity>;
      
      // We don't want to send the password in the response
      const { password, ...userWithoutPassword } = user as any;

      const token = this.authService.generateToken(userWithoutPassword);

      res.cookie("jwt", token, {
        httpOnly: true,
        secure: ENV.NODE_ENV === "production",
        sameSite: ENV.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json(new ApiResp("Logged in successfully", 200, true, { user: userWithoutPassword, token }));
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.cookie("jwt", "", {
        httpOnly: true,
        secure: ENV.NODE_ENV === "production",
        sameSite: ENV.NODE_ENV === "production" ? "none" : "lax",
        expires: new Date(0),
      });
      res.status(200).json(new ApiResp("Logged out successfully", 200, true));
    } catch (error) {
      next(error);
    }
  }

  async me(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.status(200).json(new ApiResp("Current user profile", 200, true, { user: req.user }));
    } catch (error) {
      next(error);
    }
  }

  /** Shared callback for Google/GitHub OAuth — sets JWT cookie and redirects to frontend */
  async oauthCallback(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user as Partial<UserEntity>;
      const { password, ...userWithoutPassword } = user as any;

      const token = this.authService.generateToken(userWithoutPassword);

      res.cookie("jwt", token, {
        httpOnly: true,
        secure: ENV.NODE_ENV === "production",
        sameSite: ENV.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      // Redirect to the frontend after successful OAuth
      const clientUrl = ENV.CLIENT_URL[0]; // first allowed origin
      res.redirect(clientUrl);
    } catch (error) {
      next(error);
    }
  }

  async verifyEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { token } = req.query;
      if (!token || typeof token !== "string") {
        res.status(400).json(new ApiResp("Token is required", 400, false));
        return;
      }
      await this.authService.verifyEmail(token);
      res.status(200).json(new ApiResp("Email verified successfully", 200, true));
    } catch (error) {
      next(error);
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.body;
      if (!email) {
        res.status(400).json(new ApiResp("Email is required", 400, false));
        return;
      }
      await this.authService.forgotPassword(email);
      res.status(200).json(new ApiResp("If an account exists, a password reset email has been sent", 200, true));
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { token, newPassword } = req.body;
      if (!token || !newPassword) {
        res.status(400).json(new ApiResp("Token and new password are required", 400, false));
        return;
      }
      await this.authService.resetPassword(token, newPassword);
      res.status(200).json(new ApiResp("Password reset successfully", 200, true));
    } catch (error) {
      next(error);
    }
  }
}
