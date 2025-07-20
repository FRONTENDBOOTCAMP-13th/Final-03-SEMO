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
    phone?: string;
    address?: string;
    type: string;
    image?: string;
    extra?: {
      nickname?: string;
      bank?: string;
      bankNumber?: number;
    };
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
  phone?: string;
  address?: string;
  type: string;
  image?: string;
  extra?: {
    nickname?: string;
    bank?: string;
    bankNumber?: number;
  };
}

// 일반적인 API 응답 구조(제네릭 T를 사용하여 응답 데이터의 타입을 유연하게 지정!)
export interface ApiResponse<T> {
  ok: number;
  item?: T;
  items?: T[];
  message?: string;
}

// 사용자 프로필 업데이트 시 필요한 데이터
export interface UserProfileFormData {
  nickname: string;
  bank: string;
  accountNumber: string;
  profileImage?: string | null;
}
