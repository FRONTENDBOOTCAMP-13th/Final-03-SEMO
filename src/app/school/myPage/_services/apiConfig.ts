export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL,
  CLIENT_ID: process.env.NEXT_PUBLIC_CLIENT_ID,
} as const;

export class ApiUtils {
  /**
   * API 요청용 헤더 생성
   */
  static createHeaders(
    options: {
      includeAuth?: boolean;
      isFormData?: boolean;
      token?: string | null;
    } = {}
  ): HeadersInit {
    const { includeAuth = false, isFormData = false, token = null } = options;

    const headers: HeadersInit = {
      "client-id": API_CONFIG.CLIENT_ID ?? "",
    };

    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }

    if (includeAuth && token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  }

  /**
   * API 응답 에러 처리
   */
  static handleApiError(data: any, defaultMessage: string): never {
    throw new Error(data.message || defaultMessage);
  }
}
