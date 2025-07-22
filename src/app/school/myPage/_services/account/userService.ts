// userService.ts - 사용자 프로필

// 사용자 정보 조회/수정
// 프로필 이미지 업데이트
// Extra 정보 업데이트
// 현재 사용자 정보 관리
/**
 * 사용자 프로필 관련 API 서비스
 * 사용자 정보 조회, 수정 등을 담당
 */
import { User } from "@/app/school/myPage/_types/user";
import apiClient from "../apiClient";
import ImageService from "../imageService";

class UserService {
  /**
   * 사용자 정보 조회
   */
  static async getUserById(userId: number): Promise<User> {
    const user = await apiClient.get<User>(`/users/${userId}`);
    if (user.image) {
      user.image = ImageService.getImageUrl(user.image) || undefined;
    }
    return user;
  }

  /**
   * 사용자 정보 수정
   */
  static async updateUser(userId: number, updateData: Partial<User>): Promise<User> {
    const user = await apiClient.patch<User>(`/users/${userId}`, updateData);
    if (user.image) {
      user.image = ImageService.getImageUrl(user.image) || undefined;
    }
    return user;
  }

  static async updateUserProfileImage(
    userId: number,
    imageFile?: File | null,
    removeImage: boolean = false
  ): Promise<User> {
    const updateData: Partial<User> = {};

    if (removeImage) {
      updateData.image = "";
    } else if (imageFile) {
      const imageUrl = await ImageService.uploadFile(imageFile);
      const imagePath = ImageService.extractImagePath(imageUrl);
      updateData.image = imagePath || "";
    }

    return this.updateUser(userId, updateData);
  }

  /**
   * 사용자 extra 정보 업데이트 헬퍼
   */
  static async updateUserExtra(
    userId: number,
    extraData: {
      nickname?: string;
      bank?: string;
      bankNumber?: number;
      [key: string]: any;
    }
  ): Promise<User> {
    const updateData: Partial<User> = {
      extra: extraData,
    };

    return this.updateUser(userId, updateData);
  }
}

export default UserService;
