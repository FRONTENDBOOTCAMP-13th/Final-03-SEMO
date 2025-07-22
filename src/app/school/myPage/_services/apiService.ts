// apiService.ts - 통합 서비스
/**
 * 마이페이지 통합 API 서비스
 * 리팩토링된 버전 - 각 서비스들을 조합하여 사용
 */

import type { User } from "@/app/school/myPage/_types/user";
import AuthService from "./authService";
import UserService from "./userService";
import ImageService from "./imageService";

class MyPageApiService {
  static getCurrentUserId(): number | null {
    return AuthService.getCurrentUserId();
  }

  /**
   *  현재 사용자 정보 반환
   */
  static getCurrentUser(): User | null {
    return AuthService.getCurrentUser();
  }

  // 사용자 프로필 관련 메서드들
  /**
   * 사용자 정보 조회
   */
  static async getUserById(userId: number): Promise<User> {
    return UserService.getUserById(userId);
  }

  /**
   * 사용자 정보 수정
   */
  static async updateUser(userId: number, updateData: Partial<User>): Promise<User> {
    return UserService.updateUser(userId, updateData);
  }

  /**
   * 사용자 extra 정보 업데이트
   */
  static async updateUserExtra(
    userId: number,
    extraData: {
      bank?: string;
      bankNumber?: number;
      [key: string]: any;
    }
  ): Promise<User> {
    return UserService.updateUserExtra(userId, extraData);
  }

  // 이미지/파일 관련 메서드들
  /**
   * 파일 업로드 (압축된 이미지)
   */
  static async uploadFile(file: File): Promise<string> {
    return ImageService.uploadFile(file);
  }

  /**
   * 이미지 URL 생성 및 유효성 검사
   */
  static getImageUrl(imagePath: string | null | undefined): string | null {
    return ImageService.getImageUrl(imagePath);
  }

  /**
   * 안전한 이미지 URL 반환 (기본 이미지 포함)
   */
  static getSafeImageUrl(imagePath: string | null | undefined, defaultPath = "/assets/defaultimg.png"): string {
    return ImageService.getSafeImageUrl(imagePath, defaultPath);
  }

  /**
   * 이미지 URL에서 상대 경로 추출
   */
  static extractImagePath(imageUrl: string | null | undefined): string | null {
    return ImageService.extractImagePath(imageUrl);
  }

  /**
   * 사용자 프로필 이미지 업데이트
   */
  static async updateUserProfileImage(
    userId: number,
    imageFile?: File | null,
    removeImage: boolean = false
  ): Promise<User> {
    return UserService.updateUserProfileImage(userId, imageFile, removeImage);
  }
}

export default MyPageApiService;
// 각 개별 서비스도 export하여 필요시 직접 사용 가능
export { UserService, ImageService, AuthService };
