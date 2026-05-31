import { AppDataSource } from "src/configs/database";
import { UserEntity } from "src/entities/User.entity";
import { ApiError } from "src/utils/api/api.response";
import bcrypt from "bcryptjs";
import cloudinary from "src/configs/cloudinary";

export class UserService {
  private userRepo = AppDataSource.getRepository(UserEntity);

  async updateProfile(userId: string, data: { firstName: string, lastName: string, email: string }) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new ApiError("User not found", 404);
    
    user.displayName = `${data.firstName} ${data.lastName}`;
    user.email = data.email;
    await this.userRepo.save(user);
    
    const { password, ...userWithoutPassword } = user as any;
    return userWithoutPassword;
  }

  async updatePassword(userId: string, data: { currentPassword?: string, newPassword: string }) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new ApiError("User not found", 404);
    
    if (user.provider === 'local') {
       if (!data.currentPassword) throw new ApiError("Current password required", 400);
       const isMatch = await bcrypt.compare(data.currentPassword, user.password || "");
       if (!isMatch) throw new ApiError("Invalid current password", 400);
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(data.newPassword, salt);
    await this.userRepo.save(user);
    
    const { password, ...userWithoutPassword } = user as any;
    return userWithoutPassword;
  }

  async uploadAvatar(userId: string, fileBuffer: Buffer) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new ApiError("User not found", 404);

    return new Promise((resolve, reject) => {
       const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "live-polling/avatars", public_id: `avatar_${userId}`, overwrite: true },
          async (error, result) => {
             if (error) return reject(new ApiError("Image upload failed", 500));
             if (result) {
                user.avatarUrl = result.secure_url;
                await this.userRepo.save(user);
                const { password, ...userWithoutPassword } = user as any;
                resolve(userWithoutPassword);
             }
          }
       );
       uploadStream.end(fileBuffer);
    });
  }

  async updateEmailNotifications(userId: string, enabled: boolean) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new ApiError("User not found", 404);
    user.emailNotifications = enabled;
    await this.userRepo.save(user);
    
    const { password, ...userWithoutPassword } = user as any;
    return userWithoutPassword;
  }
}
