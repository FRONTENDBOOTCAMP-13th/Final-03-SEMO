import { API_CONFIG } from "./apiConfig";
import AuthService from "./authService";

// API 요청에 필요한 공통 헤더를 생성

// 기본적으로 "client-id"와 "Content-Type"을 설정하고

// AuthService에서 토큰을 가져와서 "Authorization" 헤더에 추가
const createApiHeaders = (isFormData = false): HeadersInit => {
  const headers: HeadersInit = {
    "client-id": API_CONFIG.CLIENT_ID ?? "",
  };

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const token = AuthService.getAccessToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
};

// API 응답을 처리하는 함수: 성공 시 data.item을 반환
const handleApiResponse = async (response: Response) => {
  const data = await response.json();
  if (!response.ok || data.ok !== 1) {
    throw new Error(data.message || "API 요청에 실패했습니다.");
  }
  return data.item;
};

const apiClient = {
  async get<T>(path: string): Promise<T> {
    const response = await fetch(`${API_CONFIG.BASE_URL}${path}`, {
      method: "GET",
      headers: createApiHeaders(),
    });
    return handleApiResponse(response);
  },

  async post<T>(path: string, body: any): Promise<T> {
    const response = await fetch(`${API_CONFIG.BASE_URL}${path}`, {
      method: "POST",
      headers: createApiHeaders(),
      body: JSON.stringify(body),
    });
    return handleApiResponse(response);
  },

  async patch<T>(path: string, body: any): Promise<T> {
    const response = await fetch(`${API_CONFIG.BASE_URL}${path}`, {
      method: "PATCH",
      headers: createApiHeaders(),
      body: JSON.stringify(body),
    });
    return handleApiResponse(response);
  },

  async delete<T>(path: string): Promise<T> {
    const response = await fetch(`${API_CONFIG.BASE_URL}${path}`, {
      method: "DELETE",
      headers: createApiHeaders(),
    });
    return handleApiResponse(response);
  },

  async upload<T>(path: string, formData: FormData): Promise<T> {
    const response = await fetch(`${API_CONFIG.BASE_URL}${path}`, {
      method: "POST",
      headers: createApiHeaders(true),
      body: formData,
    });
    return handleApiResponse(response);
  },
};

export default apiClient;
