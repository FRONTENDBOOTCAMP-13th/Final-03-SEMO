/**
 * 마이페이지 전용 API 훅
 */

import { useState, useCallback } from "react";
import MyPageApiService, { type User } from "../_services/apiService";

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
   * 사용자 프로필 조회 (아직 구현되지 않음)
   */
  const getUserProfile = useCallback(async (userId: number): Promise<User | null> => {
    // 이 부분은 다음 커밋에서 구현됩니다.
    console.log("getUserProfile 호출됨 (아직 구현되지 않음)");
    return null;
  }, []);

  /**
   * 사용자 프로필 업데이트 (아직 구현되지 않음)
   */
  const updateUserProfile = useCallback(async (userId: number, profileData: UserProfileFormData): Promise<boolean> => {
    // 이 부분은 다음 커밋에서 구현됩니다.
    console.log("updateUserProfile 호출됨 (아직 구현되지 않음)");
    return false;
  }, []);

  /**
   * 프로필 이미지 업로드 (아직 구현되지 않음)
   */
  const uploadProfileImage = useCallback(async (file: File): Promise<string | null> => {
    // 이 부분은 다음 커밋에서 구현됩니다.
    console.log("uploadProfileImage 호출됨 (아직 구현되지 않음)");
    return null;
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
