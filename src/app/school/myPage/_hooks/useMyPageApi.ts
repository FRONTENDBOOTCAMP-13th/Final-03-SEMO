/**
 * 마이페이지 전용 API 훅
 */

import { useState, useCallback } from "react";
import MyPageApiService from "../_services/apiService";
import type { User } from "@/app/school/myPage/_types/user";
// 사용자 프로필 업데이트 시 필요한 데이터
export interface UserProfileFormData {
  nickname: string;
  bank: string;
  accountNumber: string;
  profileImage?: string | null;
}

interface UseMyPageApiReturn {
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  getUserProfile: (userId: number) => Promise<User | null>;
  updateUserProfile: (userId: number, profileData: UserProfileFormData) => Promise<boolean>;
  uploadProfileImage: (file: File) => Promise<string | null>;
}

export const useMyPageApi = (): UseMyPageApiReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * 로그인
   */
  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await MyPageApiService.login(email, password);

      if (response.ok !== 1) {
        throw new Error("로그인에 실패했습니다.");
      }

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "로그인에 실패했습니다.";
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 사용자 프로필 조회
   */
  const getUserProfile = useCallback(async (userId: number): Promise<User | null> => {
    console.log("훅에서 사용자 프로필 조회 시작:", userId);
    setLoading(true);
    setError(null);

    try {
      const user = await MyPageApiService.getUserById(userId);
      console.log("훅에서 받은 사용자 데이터:", user);
      return user;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "사용자 정보를 가져올 수 없습니다.";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 사용자 프로필 업데이트
   */
  const updateUserProfile = useCallback(async (userId: number, profileData: UserProfileFormData): Promise<boolean> => {
    console.log("훅에서 받은 프로필 데이터:", profileData);
    setLoading(true);
    setError(null);

    try {
      const updateData: Partial<User> = {
        extra: {
          nickname: profileData.nickname,
          bank: profileData.bank,
          bankNumber: parseInt(profileData.accountNumber, 10),
        },
      };

      // 이미지 처리
      if (profileData.profileImage === null) {
        // 이미지 제거를 원하는 경우
        updateData.image = undefined;
        console.log("이미지 제거 요청");
      } else if (
        profileData.profileImage &&
        typeof profileData.profileImage === "string" &&
        profileData.profileImage.trim() !== "" &&
        profileData.profileImage !== "undefined"
      ) {
        // URL이 아니라 이미 상대 경로인 경우 그대로 사용
        let imagePath = profileData.profileImage;

        // 전체 URL인 경우 path 부분만 추출
        if (imagePath.startsWith("http")) {
          // API_BASE_URL 이후의 path 부분 추출
          const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "https://fesp-api.koyeb.app/market";
          const baseUrlPattern = apiBaseUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // 정규식 이스케이프
          const pathMatch = imagePath.match(new RegExp(`${baseUrlPattern}/(.+)$`));
          if (pathMatch) {
            imagePath = pathMatch[1]; // "files/client-id/filename.jpg"
            console.log("URL에서 path 추출:", imagePath);
          }
        }

        updateData.image = imagePath;
        console.log("이미지 포함하여 업데이트 (path):", imagePath);
      } else {
        console.log("이미지 제외하고 업데이트 (이미지 값:", profileData.profileImage, ")");
        // 이미지 필드를 아예 보내지 않음
      }

      console.log("최종 전달할 updateData:", updateData);
      await MyPageApiService.updateUser(userId, updateData);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "프로필 업데이트에 실패했습니다.";
      console.error("프로필 업데이트 오류:", errorMessage);
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 프로필 이미지 업로드
   */
  const uploadProfileImage = useCallback(async (file: File): Promise<string | null> => {
    console.log("훅에서 파일 업로드 시작:", file.name, file.size, file.type);
    setLoading(true);
    setError(null);

    try {
      const imageUrl = await MyPageApiService.uploadFile(file);
      console.log("훅에서 받은 이미지 URL:", imageUrl);
      return imageUrl;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "이미지 업로드에 실패했습니다.";
      console.error("훅에서 업로드 오류:", errorMessage);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    login,
    getUserProfile,
    updateUserProfile,
    uploadProfileImage,
  };
};
