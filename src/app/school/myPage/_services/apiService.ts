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
   * 이미지 압축 및 Data URL 변환
   * Canvas API를 사용한 이미지 최적화
   */
  private static compressImage(file: File, maxWidth = 800, quality = 0.8): Promise<string> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Canvas context를 생성할 수 없습니다."));
        return;
      }

      const img = new Image();

      img.onload = () => {
        try {
          // 비율 유지하면서 크기 조정
          const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
          canvas.width = img.width * ratio;
          canvas.height = img.height * ratio;

          // 캔버스 초기화 (투명도 처리)
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // 이미지 그리기
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          // Data URL로 변환 (압축)
          const dataUrl = canvas.toDataURL("image/jpeg", quality);

          // 압축 결과 로그
          const originalSize = file.size;
          const compressedSize = Math.round(((dataUrl.length - "data:image/jpeg;base64,".length) * 3) / 4);
          console.log(
            `이미지 압축 완료: ${originalSize}bytes → ${compressedSize}bytes (${Math.round((compressedSize / originalSize) * 100)}%)`
          );

          resolve(dataUrl);
        } catch (error) {
          reject(new Error("이미지 압축 중 오류가 발생했습니다."));
        }
      };

      img.onerror = () => reject(new Error("이미지 로드 실패"));

      // 파일을 이미지 객체로 로드
      img.src = URL.createObjectURL(file);
    });
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
  /**
   * 사용자 정보 수정
   */
  static async updateUser(userId: number, updateData: Partial<User>): Promise<User> {
    this.restoreToken();

    console.log("API 서비스에서 받은 updateData:", updateData);
    console.log("업데이트 요청 URL:", `${API_BASE_URL}/users/${userId}`);

    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: "PATCH",
      headers: this.getHeaders(true),
      body: JSON.stringify(updateData),
    });

    console.log("업데이트 응답 상태:", response.status);
    const data: ApiResponse<User> = await response.json();
    console.log("업데이트 응답 데이터:", data);

    if (data.ok !== 1 || !data.item) {
      throw new Error(data.message || "사용자 정보 수정에 실패했습니다.");
    }

    console.log("최종 반환할 사용자 데이터:", data.item);
    return data.item;
  }
  /**
   * 파일 업로드
   */
  static async uploadFile(file: File): Promise<string> {
    this.restoreToken();

    try {
      console.log("파일 업로드 시작:", file.name, "크기:", file.size);

      // 이미지 압축
      const compressedDataUrl = await this.compressImage(file);

      // Data URL을 Blob으로 변환
      const response = await fetch(compressedDataUrl);
      const blob = await response.blob();

      // FormData 생성
      const formData = new FormData();
      formData.append("attach", blob, file.name);

      const uploadResponse = await fetch(`${API_BASE_URL}/files/`, {
        method: "POST",
        headers: this.getHeaders(true, true), // isFormData = true
        body: formData,
      });

      console.log("파일 업로드 응답 상태:", uploadResponse.status);
      const data = await uploadResponse.json();
      console.log("파일 업로드 응답 데이터 전체:", JSON.stringify(data, null, 2));

      if (data.ok !== 1 || !data.item || !Array.isArray(data.item) || data.item.length === 0) {
        throw new Error(data.message || "파일 업로드에 실패했습니다.");
      }

      const fileInfo = data.item[0]; // 첫 번째 파일 정보
      console.log("업로드된 파일 정보:", fileInfo);

      if (!fileInfo.path) {
        console.error("파일 경로를 찾을 수 없습니다. fileInfo:", fileInfo);
        throw new Error("업로드된 파일 경로를 찾을 수 없습니다.");
      }

      // 전체 URL 반환 (화면 표시용)
      const finalUrl = `${API_BASE_URL}/${fileInfo.path}`;
      console.log("생성된 최종 URL:", finalUrl);

      return finalUrl;
    } catch (error) {
      console.error("파일 업로드 실패:", error);
      throw error;
    }
  }
}

export default MyPageApiService;
