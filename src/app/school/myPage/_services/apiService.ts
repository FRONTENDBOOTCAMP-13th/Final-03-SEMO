/**
 * 마이페이지 전용 API 서비스
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID;

class MyPageApiService {
  // 로그인 성공 시 여기에 토큰이 저장
  private static token: string | null = null;
  // 현재 로그인한 사용자 정보 저장
  private static currentUser: any = null;

  // 헤더 생성
  private static getHeaders(includeAuth = false, isFormData = false) {
    const headers: HeadersInit = {
      "client-id": CLIENT_ID ?? "",
    };

    if (!isFormData) {
      // 일반 json 요청
      headers["Content-Type"] = "application/json";
    }

    if (includeAuth && this.token) {
      // 토큰 발급이 되었다면
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    return headers;
  }

  /**
   * 토큰 설정
   */
  static setToken(token: string) {
    this.token = token;
  }

  /**
   * 로컬 스토리지에서 토큰 복원(리프레시 토큰)
   */
  static restoreToken() {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (token) {
        this.token = token;
      }
      // 사용자 정보도 복원
      const userInfo = localStorage.getItem("currentUser");
      if (userInfo) {
        try {
          this.currentUser = JSON.parse(userInfo);
        } catch (error) {
          console.error("사용자 정보 복원 실패:", error);
        }
      }
    }
  }
}

export default MyPageApiService;
