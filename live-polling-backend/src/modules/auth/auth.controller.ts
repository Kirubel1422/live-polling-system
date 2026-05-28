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
      res.clearCookie("jwt");
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
}
