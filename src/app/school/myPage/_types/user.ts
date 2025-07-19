/**
 * 마이페이지 관련 타입 정의
 */

// 로그인 API 응답의 구조
export interface LoginResponse {
  ok: number;
  item: {
    _id: number;
    email: string;
    name: string;
    type: string;
    token: {
      accessToken: string;
      refreshToken: string;
    };
  };
}

// 사용자 정보의 기본 구조
export interface User {
  _id: number;
  email: string;
  name: string;
  type: string;
}

// 사용자 프로필 업데이트 시 필요한 데이터
export interface UserProfileFormData {
  nickname: string;
  bank: string;
  accountNumber: string;
}
