export interface User {
  _id: number; // 사용자 고유 ID
  email: string;
  name: string;
  address?: string;
  type: "user";
  loginType?: "email" | "kakao" | "google";
  image?: string;
  token?: {
    accessToken: string; // 액세스 토큰
    refreshToken: string; // 리프레시 토큰
  };
  createdAt: string; // 생성일
  updatedAt: string; // 수정일
}
