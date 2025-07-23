export interface User {
  _id: number;
  email: string;
  password: string;
  name: string; // 닉네임
  address?: string;
  type: "seller";

  // 회원가입 관련
  university?: string;
  department?: string;
  studentId?: string;
  dormitory?: string;

  // 기존 필드들
  loginType?: "email" | "kakao" | "google";
  image?: string;
  token?: {
    accessToken: string; // 액세스 토큰
    refreshToken: string; // 리프레시 토큰
  };
  createdAt: string; // 생성일
  updatedAt: string; // 수정일
}
