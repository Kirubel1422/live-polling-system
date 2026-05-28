import { AppDataSource } from "src/configs/database";
import { UserEntity } from "src/entities/User.entity";
import { ApiError } from "src/utils/api/api.response";
import { RegisterDto } from "src/validators/auth.validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ENV } from "src/constants/dotenv";

export class AuthService {
  private userRepo = AppDataSource.getRepository(UserEntity);

  async register(dto: RegisterDto): Promise<Partial<UserEntity>> {
    const existing = await this.userRepo.findOne({ where: { email: dto.email } });
    if (existing) {
      throw new ApiError("Email already exists", 400, false);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(dto.password, salt);

    const user = this.userRepo.create({
      displayName: dto.name,
      email: dto.email,
      password: hashedPassword,
    });

    const savedUser = await this.userRepo.save(user);
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
}
