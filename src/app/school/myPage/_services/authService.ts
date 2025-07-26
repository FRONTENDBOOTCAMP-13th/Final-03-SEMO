// 로그인 후 사용자 정보와 토큰을 저장하고, 필요할 때 불러오거나 초기화하는 데 사용
import { User, LoginResponse } from "@/app/school/myPage/_types/user";
import apiClient from "./apiClient";

class AuthService {
  private static accessToken: string | null = null;
  private static currentUser: User | null = null;

  // 로그인 성공 시 사용자 정보(user)와 JWT 토큰(token)을 전달받아 저장
  static setAuth(user: User, token: string) {
    this.currentUser = user;
    this.accessToken = token;
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", token);
      localStorage.setItem("user", JSON.stringify(user));
    }
  }

  // 새로고침 후, 메모리에 사용자 정보가 없을 때 localStorage에서 복구하는 함수
  static restoreAuth() {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      const userJson = localStorage.getItem("user");
      if (token && userJson) {
        this.accessToken = token;
        this.currentUser = JSON.parse(userJson);
      }
    }
  }

  // 로그아웃 등 인증을 해제할 때 호출
  static clearAuth() {
    this.accessToken = null;
    this.currentUser = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
    }
  }

  // 토큰을 메모리에서 가져옴: 없다면 restoreAuth()를 통해 localStorage에서 복구
  static getAccessToken(): string | null {
    if (!this.accessToken) {
      this.restoreAuth();
    }
    return this.accessToken;
  }

  static getCurrentUser(): User | null {
    if (!this.currentUser) {
      this.restoreAuth();
    }
    return this.currentUser;
  }

  static getCurrentUserId(): number | null {
    const user = this.getCurrentUser();
    return user?._id || null;
  }

  static async login(email: string, password: string): Promise<User> {
    const response = await apiClient.post<LoginResponse>("/users/login", { email, password });
    if (response.item?.token?.accessToken && response.item) {
      const user: User = {
        _id: response.item._id ?? 0,
        email: response.item.email ?? "",
        password: password,
        name: response.item.name ?? "",
        address: response.item.address ?? "",
        type: response.item.type ?? "",
        image: response.item.image ?? "",
        extra: response.item.extra ?? {},
        createdAt: response.item.createdAt ?? "",
        updatedAt: response.item.updatedAt ?? "",
      };
      this.setAuth(user, response.item.token.accessToken);
      return user;
    }
    throw new Error("로그인에 실패했습니다.");
  }
}

export default AuthService;
