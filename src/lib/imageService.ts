// imageService.ts - 이미지/파일 처리

// 이미지 압축 및 최적화
// 파일 업로드
// 이미지 URL 생성 및 변환
// 이미지 유효성 검사
/**
 * 이미지/파일 처리 전용 서비스
 * 이미지 압축, 업로드, URL 생성 등을 담당
 */

import apiClient /* API_CONFIG */ from "./apiClient";

class ImageService {
  /**
   * 인증된 파일 업로드 - 프로필 이미지용
   */
  static async uploadFile(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("attach", file);

    const result = await apiClient.upload<{ path: string }[]>("/files/", formData);
    if (!result || result.length === 0 || !result[0].path) {
      throw new Error("파일 업로드에 실패했습니다.");
    }

    return result[0].path;
  }

  /**
   * 안전한 이미지 URL 반환 (기본 이미지 포함)
   */
  static getSafeImageUrl(imagePath: string | null | undefined, defaultPath = "/assets/defaultimg.png"): string {
    if (!imagePath || typeof imagePath !== "string" || imagePath.trim() === "" || imagePath === "undefined") {
      return defaultPath;
    }

    // 이미 완전한 URL인 경우 (Cloudinary, HTTP 등)
    if (imagePath.startsWith("http") || imagePath.startsWith("https") || imagePath.startsWith("data:")) {
      return imagePath;
    }

    // 로컬 파일 경로인 경우 슬래시 추가
    if (!imagePath.startsWith("/")) {
      return `/${imagePath}`;
    }

    return imagePath;
  }
}

export default ImageService;
