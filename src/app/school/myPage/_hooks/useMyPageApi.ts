/**
 * 마이페이지 전용 API 훅 (리팩토링된 버전)
 * 분리된 서비스들을 사용하여 구현
 */

import { useState, useCallback } from "react";
import MyPageApiService, { ImageService, UserService } from "../_services/apiService";
import type { User, UserProfileFormData } from "@/app/school/myPage/_types/user";

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
   *  임시 로그인 (추후 제거 예정)
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
      const user = await UserService.getUserById(userId);
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
      // 기본 사용자 정보 업데이트 (name 등 루트 User 타입에 있는 필드들)
      const updateData: Partial<User> = {
        name: profileData.name,
      };

      await MyPageApiService.updateUser(userId, updateData);

      // extra 정보 업데이트 (루트 User 타입에 없는 필드들)
      if (profileData.bank || profileData.accountNumber) {
        const extraData: { bank?: string; bankNumber?: number } = {};

        if (profileData.bank) {
          extraData.bank = profileData.bank;
        }

        if (profileData.accountNumber) {
          extraData.bankNumber = parseInt(profileData.accountNumber, 10);
        }

        await UserService.updateUserExtra(userId, extraData);
        console.log("extra 정보 업데이트 완료:", extraData);
      }

      // 이미지 처리
      if (profileData.profileImage === null) {
        // 이미지 제거 요청 - 빈 문자열로 설정
        console.log("이미지 제거 요청 시작...");
        await MyPageApiService.updateUser(userId, { image: "" });
        console.log("이미지 제거 완료");
      } else if (
        profileData.profileImage &&
        typeof profileData.profileImage === "string" &&
        profileData.profileImage.trim() !== "" &&
        profileData.profileImage !== "undefined"
      ) {
        // 이미지 경로 업데이트
        const imagePath = ImageService.extractImagePath(profileData.profileImage);
        if (imagePath) {
          await MyPageApiService.updateUser(userId, { image: imagePath });
          console.log("이미지 경로 업데이트 완료:", imagePath);
        }
      } else if (profileData.profileImage === undefined) {
        // profileImage가 undefined인 경우 이미지 필드를 변경하지 않음
        console.log("이미지 필드 변경 없음 (undefined)");
      }

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
      const imageUrl = await ImageService.uploadFile(file);
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
