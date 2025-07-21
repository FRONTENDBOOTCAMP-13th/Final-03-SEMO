// userService.ts - 사용자 프로필

// 사용자 정보 조회/수정
// 프로필 이미지 업데이트
// Extra 정보 업데이트
// 현재 사용자 정보 관리
/**
 * 사용자 프로필 관련 API 서비스
 * 사용자 정보 조회, 수정 등을 담당
 */

import { User, ApiResponse } from "@/app/school/myPage/_types/user";
import { API_CONFIG, ApiUtils } from "./apiConfig";
import ImageService from "./imageService";
import TempAuthService from "./tempAuthService";

class UserService {
  /**
   * 사용자 정보 조회
   */
  static async getUserById(userId: number): Promise<User> {
    console.log("사용자 정보 조회 시작 - ID:", userId);

    // 임시 토큰 복원
    TempAuthService.restoreToken();
    const token = TempAuthService.getCurrentToken();

    console.log("사용중인 토큰:", token ? "O" : "X");

    const response = await fetch(`${API_CONFIG.BASE_URL}/users/${userId}`, {
      headers: ApiUtils.createHeaders({ includeAuth: true, token }),
    });

    console.log("API 응답 상태:", response.status);
    const data: ApiResponse<User> = await response.json();
    console.log("API 응답 데이터:", data);

    if (data.ok !== 1 || !data.item) {
      ApiUtils.handleApiError(data, "사용자 정보를 가져올 수 없습니다.");
    }

    // 이미지 URL 처리
    if (data.item.image) {
      console.log("원본 이미지 경로:", data.item.image);

      if (ImageService.isValidImageUrl(data.item.image)) {
        data.item.image = ImageService.getImageUrl(data.item.image) || undefined;
        console.log("변환된 이미지 URL:", data.item.image);
      } else {
        console.warn("유효하지 않은 이미지:", data.item.image);
        data.item.image = undefined;
      }
    }

    console.log("최종 처리된 사용자 데이터:", data.item);
    return data.item;
  }

  /**
   * 사용자 정보 수정
   */
  static async updateUser(userId: number, updateData: Partial<User>): Promise<User> {
    console.log("사용자 정보 수정 요청:", { userId, updateData });

    // 임시 토큰 복원
    TempAuthService.restoreToken();
    const token = TempAuthService.getCurrentToken();

    const response = await fetch(`${API_CONFIG.BASE_URL}/users/${userId}`, {
      method: "PATCH",
      headers: ApiUtils.createHeaders({ includeAuth: true, token }),
      body: JSON.stringify(updateData),
    });

    console.log("업데이트 응답 상태:", response.status);
    const data: ApiResponse<User> = await response.json();
    console.log("업데이트 응답 데이터:", data);

    if (data.ok !== 1 || !data.item) {
      ApiUtils.handleApiError(data, "사용자 정보 수정에 실패했습니다.");
    }

    // 이미지 URL 처리
    if (data.item.image) {
      if (ImageService.isValidImageUrl(data.item.image)) {
        data.item.image = ImageService.getImageUrl(data.item.image) || undefined;
      } else {
        data.item.image = undefined;
      }
    }

    console.log("최종 반환할 사용자 데이터:", data.item);
    return data.item;
  }

  /**
   * 현재 로그인한 사용자 ID 반환
   */
  static getCurrentUserId(): number | null {
    //  임시 인증 서비스 사용
    return TempAuthService.getCurrentUserId();
  }

  /**
   * 현재 로그인한 사용자 정보 반환
   */
  static getCurrentUser(): User | null {
    // 임시 인증 서비스 사용
    return TempAuthService.getCurrentUser();
  }

  /**
   * 사용자 프로필 이미지 업데이트 헬퍼
   */
  static async updateUserProfileImage(
    userId: number,
    imageFile?: File | null,
    removeImage: boolean = false
  ): Promise<User> {
    let updateData: Partial<User> = {};

    if (removeImage) {
      // 이미지 제거
      updateData.image = undefined;
    } else if (imageFile) {
      // 새 이미지 업로드 후 업데이트
      const imageUrl = await ImageService.uploadFile(imageFile);
      const imagePath = ImageService.extractImagePath(imageUrl);
      updateData.image = imagePath || undefined;
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
