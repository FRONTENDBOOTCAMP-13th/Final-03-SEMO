/**
 * 마이페이지 전용 API 서비스
 */
// 로그인 API 응답의 구조
import { LoginResponse } from "@/app/school/myPage/_types/user";
// 사용자 정보의 구조
import { User } from "@/app/school/myPage/_types/user";
// 일반적인 API 응답 구조
import { ApiResponse } from "@/app/school/myPage/_types/user";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID;

class MyPageApiService {
  // 로그인 성공 시 여기에 토큰이 저장
  private static token: string | null = null;
  // 현재 로그인한 사용자 정보 저장
  private static currentUser: User | null = null;

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
   * 로그인 API
   */
  static async login(email: string, password: string): Promise<LoginResponse> {
    console.log("로그인 시도:", email);

    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify({ email, password }),
    });

    console.log("로그인 응답 상태:", response.status);
    const data = await response.json();
    console.log("로그인 응답 데이터:", data);

    if (data.ok === 1 && data.item?.token?.accessToken) {
      this.token = data.item.token.accessToken;
      // 현재 로그인한 사용자 정보 저장
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
      console.log("토큰 저장 완료:", this.token ? this.token.substring(0, 20) + "..." : "null");
      console.log("현재 사용자 정보 저장:", this.currentUser);

      // 로컬 스토리지에 토큰 저장
      if (typeof window !== "undefined" && this.token) {
        localStorage.setItem("accessToken", this.token);
        localStorage.setItem("currentUser", JSON.stringify(this.currentUser));
        console.log("로컬 스토리지에 토큰과 사용자 정보 저장 완료");
      }
    }

    return data;
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

  /**
   * 현재 로그인한 사용자의 ID 반환
   */
  static getCurrentUserId(): number | null {
    if (this.currentUser && this.currentUser._id) {
      return this.currentUser._id;
    }

    this.restoreToken();
    return this.currentUser && this.currentUser._id ? this.currentUser._id : null;
  }

  /**
   * 현재 로그인한 사용자 정보 반환
   */
  static getCurrentUser(): User | null {
    if (this.currentUser) {
      return this.currentUser;
    }

    this.restoreToken();
    return this.currentUser;
  }

  /**
   * 사용자 정보 조회
   */
  static async getUserById(userId: number): Promise<User> {
    this.restoreToken();

    console.log("API 요청 시작 - 사용자 ID:", userId);
    console.log("사용중인 토큰:", this.token ? "O" : "X");

    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      headers: this.getHeaders(true),
    });

    console.log("API 응답 상태:", response.status);
    const data: ApiResponse<User> = await response.json();
    console.log("API 응답 데이터:", data);

    if (data.ok !== 1 || !data.item) {
      throw new Error(data.message || "사용자 정보를 가져올 수 없습니다.");
    }

    return data.item;
  }
}

export default MyPageApiService;
