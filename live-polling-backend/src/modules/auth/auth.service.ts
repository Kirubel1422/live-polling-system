import { AppDataSource } from "src/configs/database";
import { UserEntity } from "src/entities/User.entity";
import { ApiError } from "src/utils/api/api.response";
import { RegisterDto } from "src/validators/auth.validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ENV } from "src/constants/dotenv";
import crypto from "crypto";
import { sendEmail } from "src/utils/mailer";

export class AuthService {
  private userRepo = AppDataSource.getRepository(UserEntity);

  async register(dto: RegisterDto): Promise<Partial<UserEntity>> {
    const existing = await this.userRepo.findOne({ where: { email: dto.email } });
    if (existing) {
      throw new ApiError("Email already exists", 400, false);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(dto.password, salt);

    const verificationToken = crypto.randomBytes(32).toString("hex");

    const user = this.userRepo.create({
      displayName: dto.name,
      email: dto.email,
      password: hashedPassword,
      emailVerificationToken: verificationToken,
    });

    const savedUser = await this.userRepo.save(user);

    // Send verification email asynchronously
    const verificationUrl = `${ENV.CLIENT_URL[0]}/verify-email?token=${verificationToken}`;
    sendEmail(
      savedUser.email,
      "Verify your email address",
      `<p>Hi ${savedUser.displayName},</p><p>Please verify your email address by clicking the link below:</p><p><a href="${verificationUrl}">${verificationUrl}</a></p>`
    ).catch(err => console.error("Failed to send verification email:", err));

    const { password, ...userWithoutPassword } = savedUser as any;
    return userWithoutPassword as Partial<UserEntity>;
  }

  generateToken(user: Partial<UserEntity>): string {
    return jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      (ENV.JWT_SECRET as string),
      { expiresIn: ENV.JWT_EXPIRES_IN as any }
    );
  }

  async verifyEmail(token: string): Promise<boolean> {
    const user = await this.userRepo.findOne({ where: { emailVerificationToken: token } });
    if (!user) {
      throw new ApiError("Invalid or expired verification token", 400);
    }
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    await this.userRepo.save(user);
    return true;
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) return; // Silent return for security

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
    await this.userRepo.save(user);

    const resetUrl = `${ENV.CLIENT_URL[0]}/reset-password?token=${resetToken}`;
    await sendEmail(
      user.email,
      "Password Reset Request",
      `<p>You requested a password reset.</p><p>Click here to reset your password:</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>If you did not request this, please ignore this email.</p>`
    );
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await this.userRepo.createQueryBuilder("user")
      .where("user.resetPasswordToken = :token", { token })
      .andWhere("user.resetPasswordExpires > :now", { now: new Date() })
      .getOne();

    if (!user) {
      throw new ApiError("Password reset token is invalid or has expired", 400);
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await this.userRepo.save(user);
  }
}
