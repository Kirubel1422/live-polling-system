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

    const timestamp = Math.round((new Date).getTime() / 1000);
    const params = { folder: "live-polling/avatars", public_id: `avatar_${userId}`, overwrite: true, timestamp };
    const signature = cloudinary.utils.api_sign_request(params, process.env.CLOUDINARY_API_SECRET!);

    const formData = new FormData();
    formData.append("file", new Blob([new Uint8Array(fileBuffer)], { type: "image/png" }), "avatar.png");
    formData.append("api_key", process.env.CLOUDINARY_API_KEY!);
    formData.append("timestamp", timestamp.toString());
    formData.append("signature", signature);
    formData.append("folder", "live-polling/avatars");
    formData.append("public_id", `avatar_${userId}`);
    formData.append("overwrite", "true");

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        console.error("Cloudinary error response:", await res.text());
        throw new ApiError("Image upload failed", 500);
      }

      const result = await res.json();
      user.avatarUrl = result.secure_url;
      await this.userRepo.save(user);

      const { password, ...userWithoutPassword } = user as any;
      return userWithoutPassword;
    } catch (error) {
      console.error("Cloudinary fetch error:", error);
      throw new ApiError("Image upload failed", 500);
    }
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
