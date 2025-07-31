// imageService.ts - 이미지/파일 처리

// 이미지 압축 및 최적화
// 파일 업로드
// 이미지 URL 생성 및 변환
// 이미지 유효성 검사
/**
 * 이미지/파일 처리 전용 서비스
 * 이미지 압축, 업로드, URL 생성 등을 담당
 */

import apiClient, { API_CONFIG } from "./apiClient";

class ImageService {
  /**
   * 인증된 파일 업로드 - 프로필 이미지용
   */
  static async uploadFile(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("attach", blob, file.name);

    const result = await apiClient.upload<{ path: string }[]>("/files/", formData);
    if (!result || result.length === 0 || !result[0].path) {
      throw new Error("파일 업로드에 실패했습니다.");
    }

    return `${API_CONFIG.BASE_URL}/${result[0].path}`;
  }

  /**
   * 이미지 URL 생성 및 유효성 검사
   */
  static getImageUrl(imagePath: string | null | undefined): string | null {
    if (!imagePath || typeof imagePath !== "string" || imagePath === "undefined" || imagePath.trim() === "") {
      return null;
    }

    // 이미 완전한 URL인 경우
    if (imagePath.startsWith("http") || imagePath.startsWith("data:")) {
      return imagePath;
    }

    // path가 "files/client-id/filename" 형태라면 API_BASE_URL만 앞에 붙임
    if (imagePath.startsWith("files/")) {
      return `${API_CONFIG.BASE_URL}/${imagePath}`;
    }
    // 기존 방식 (파일명만 있는 경우)
    return `${API_CONFIG.BASE_URL}/files/${API_CONFIG.CLIENT_ID}/${imagePath}`;
  }

  /**
   * 안전한 이미지 URL 반환 (기본 이미지 포함)
   */
  static getSafeImageUrl(imagePath: string | null | undefined, defaultPath = "/assets/defaultimg.png"): string {
    const url = this.getImageUrl(imagePath);
    return url || defaultPath;
  }

  /**
   * 이미지 URL에서 상대 경로 추출
   */
  static extractImagePath(imageUrl: string | null | undefined): string | null {
    if (!imageUrl || typeof imageUrl !== "string") {
      return null;
    }

    // 이미 상대 경로인 경우
    if (!imageUrl.startsWith("http")) {
      return imageUrl;
    }

    // 전체 URL에서 path 부분만 추출
    const apiBaseUrl = API_CONFIG.BASE_URL || "";
    const baseUrlPattern = apiBaseUrl.replace(/[.*+?^${}()|[\\]/g, "\\$&");
    const pathMatch = imageUrl.match(new RegExp(`${baseUrlPattern}/(.+)$`));
    return pathMatch ? pathMatch[1] : null;
  }

  /**
   * 이미지 유효성 검사
   */
  static isValidImageUrl(imagePath: string | null | undefined): boolean {
    if (!imagePath || typeof imagePath !== "string" || imagePath === "undefined" || imagePath.trim() === "") {
      return false;
    }
    return (
      imagePath.startsWith("http") ||
      imagePath.startsWith("data:") ||
      imagePath.startsWith("files/") ||
      imagePath.includes(".")
    );
  }
}

export default ImageService;
