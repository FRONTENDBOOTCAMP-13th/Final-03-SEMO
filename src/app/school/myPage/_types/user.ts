/**
 * 마이페이지 관련 타입 정의
 */

// 루트 User 타입 import
import { User as BaseUser } from "@/types/user";

// myPage에서 사용할 확장된 User 타입 (extra 필드 추가)
export interface User extends BaseUser {
  extra?: {
    bank?: string;
    bankNumber?: number;
    [key: string]: any; // 향후 확장 가능
  };
}

// 로그인 API 응답의 구조
export interface LoginResponse {
  ok: number;
  item: User; // 루트 User 타입에 이미 token이 포함되어 있음
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
  name: string; // 기본 User 필드
  bank?: string; // extra 필드에 저장될 데이터
  accountNumber?: string; // extra 필드에 저장될 데이터 (bankNumber로 변환)
  profileImage?: string | null;
}
