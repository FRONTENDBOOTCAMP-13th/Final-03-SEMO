/**
 * 마이페이지 전용 API 서비스
 * 이미지 처리 및 압축 기능 포함
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
   */
  private static compressImage(file: File, maxWidth = 800, quality = 0.8): Promise<string> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        // 비율 유지하면서 크기 조정
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;

        // 이미지 그리기
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Data URL로 변환 (압축)
        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(dataUrl);
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
        // 사용자 정보도 로컬 스토리지에 저장
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
    // 메모리에서 먼저 확인
    if (this.currentUser && this.currentUser._id) {
      return this.currentUser._id;
    }

    // 로컬 스토리지에서 복원 시도
    this.restoreToken();
    return this.currentUser && this.currentUser._id ? this.currentUser._id : null;
  }

  /**
   * 현재 로그인한 사용자 정보 반환
   */
  static getCurrentUser(): User | null {
    // 메모리에서 먼저 확인
    if (this.currentUser) {
      return this.currentUser;
    }

    // 로컬 스토리지에서 복원 시도
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

    // 이미지 URL 처리
    if (data.item.image) {
      console.log("원본 이미지 경로:", data.item.image, "타입:", typeof data.item.image);

      if (
        typeof data.item.image === "string" &&
        data.item.image !== "undefined" &&
        data.item.image.trim() !== "" &&
        !data.item.image.startsWith("http") &&
        !data.item.image.startsWith("data:")
      ) {
        // path가 "files/client-id/filename" 형태라면 API_BASE_URL만 앞에 붙임
        if (data.item.image.startsWith("files/")) {
          data.item.image = `${API_BASE_URL}/${data.item.image}`;
        } else {
          // 기존 방식 (파일명만 있는 경우)
          data.item.image = `${API_BASE_URL}/files/${CLIENT_ID}/${data.item.image}`;
        }
        console.log("변환된 이미지 URL:", data.item.image);
      } else if (
        typeof data.item.image !== "string" ||
        data.item.image === "undefined" ||
        data.item.image.trim() === ""
      ) {
        console.warn("이미지가 유효하지 않습니다:", data.item.image);
        data.item.image = undefined; // 안전하게 undefined로 설정
      }
    }

    console.log("최종 처리된 사용자 데이터:", data.item);
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

    // 이미지 URL 처리
    if (data.item.image) {
      if (
        typeof data.item.image === "string" &&
        data.item.image !== "undefined" &&
        data.item.image.trim() !== "" &&
        !data.item.image.startsWith("http") &&
        !data.item.image.startsWith("data:")
      ) {
        // path가 "files/client-id/filename" 형태라면 API_BASE_URL만 앞에 붙임
        if (data.item.image.startsWith("files/")) {
          data.item.image = `${API_BASE_URL}/${data.item.image}`;
        } else {
          // 기존 방식 (파일명만 있는 경우)
          data.item.image = `${API_BASE_URL}/files/${CLIENT_ID}/${data.item.image}`;
        }
      } else if (
        typeof data.item.image !== "string" ||
        data.item.image === "undefined" ||
        data.item.image.trim() === ""
      ) {
        data.item.image = undefined;
      }
    }

    console.log("최종 반환할 사용자 데이터:", data.item);
    return data.item;
  }
  /**
   * 파일 업로드 (압축된 이미지)
   */
  static async uploadFile(file: File): Promise<string> {
    this.restoreToken();

    try {
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

  /**
   * 이미지 URL 생성 및 유효성 검사
   */
  static getImageUrl(imagePath: string | null | undefined): string | null {
    if (!imagePath || typeof imagePath !== "string" || imagePath === "undefined" || imagePath.trim() === "") {
      return null;
    }

    if (imagePath.startsWith("http") || imagePath.startsWith("data:")) {
      return imagePath;
    }

    // path가 "files/client-id/filename" 형태라면 API_BASE_URL만 앞에 붙임
    if (imagePath.startsWith("files/")) {
      return `${API_BASE_URL}/${imagePath}`;
    }

    // 기존 방식 (파일명만 있는 경우)
    return `${API_BASE_URL}/files/${CLIENT_ID}/${imagePath}`;
  }

  /**
   * 안전한 이미지 URL 반환 (기본 이미지 포함)
   */
  static getSafeImageUrl(imagePath: string | null | undefined, defaultPath = "/assets/defaultimg.png"): string {
    const url = this.getImageUrl(imagePath);
    return url || defaultPath;
  }
}

export default MyPageApiService;
