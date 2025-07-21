// tempAuthService.ts -   임시 인증 (추후 제거)

// 로그인, 토큰 관리
// 현재 사용자 정보 관리
// 로컬 스토리지 관리
// 주의: 모든 메서드와 변수는 코드임
/**
 *   임시 인증 서비스 - 추후 제거 예정
 *
 * 다른 담당자가 인증 시스템을 개발하면 이 파일은 삭제될 예정입니다.
 * 현재는 테스트 목적으로만 사용됩니다.
 */

import { LoginResponse, User } from "@/app/school/myPage/_types/user";
import { API_CONFIG, ApiUtils } from "./apiConfig";

class TempAuthService {
  //   임시 토큰 저장소
  private static token: string | null = null;
  private static currentUser: User | null = null;

  /**
   *   임시 로그인 API (추후 제거 예정)
   */
  static async login(email: string, password: string): Promise<LoginResponse> {
    console.log("  임시 로그인 시도:", email);

    const response = await fetch(`${API_CONFIG.BASE_URL}/users/login`, {
      method: "POST",
      headers: ApiUtils.createHeaders(),
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    console.log("  임시 로그인 응답:", data);

    if (data.ok === 1 && data.item?.token?.accessToken) {
      this.token = data.item.token.accessToken;
      this.currentUser = {
        _id: data.item._id,
        email: data.item.email,
        name: data.item.name,
        phone: data.item.phone,
        address: data.item.address,
        type: data.item.type,
        image: data.item.image,
        extra: data.item.extra,
      };

      //   임시 로컬 스토리지 저장
      if (typeof window !== "undefined" && this.token) {
        localStorage.setItem("temp_accessToken", this.token);
        localStorage.setItem("temp_currentUser", JSON.stringify(this.currentUser));
      }
    }

    return data;
  }

  /**
   *   임시 토큰 설정
   */
  static setToken(token: string) {
    this.token = token;
  }

  /**
   *   임시 토큰 복원
   */
  static restoreToken() {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("temp_accessToken");
      if (token) {
        this.token = token;
      }

      const userInfo = localStorage.getItem("temp_currentUser");
      if (userInfo) {
        try {
          this.currentUser = JSON.parse(userInfo);
        } catch (error) {
          console.error("  임시 사용자 정보 복원 실패:", error);
        }
      }
    }
  }

  /**
   *   임시 현재 사용자 ID 반환
   */
  static getCurrentUserId(): number | null {
    if (this.currentUser && this.currentUser._id) {
      return this.currentUser._id;
    }

    this.restoreToken();
    return this.currentUser && this.currentUser._id ? this.currentUser._id : null;
  }

  /**
   *   임시 현재 사용자 정보 반환
   */
  static getCurrentUser(): User | null {
    if (this.currentUser) {
      return this.currentUser;
    }

    this.restoreToken();
    return this.currentUser;
  }

  /**
   *   임시 현재 토큰 반환
   */
  static getCurrentToken(): string | null {
    if (this.token) {
      return this.token;
    }

    this.restoreToken();
    return this.token;
  }

  /**
   *   임시 로그아웃 (토큰 및 사용자 정보 삭제)
   */
  static logout() {
    this.token = null;
    this.currentUser = null;

    if (typeof window !== "undefined") {
      localStorage.removeItem("temp_accessToken");
      localStorage.removeItem("temp_currentUser");
    }
  }
}

export default TempAuthService;
