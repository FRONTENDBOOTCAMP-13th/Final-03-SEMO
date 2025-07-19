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
}

export default MyPageApiService;
