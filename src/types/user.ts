export interface User {
  _id?: number; // 사용자 ID (생략 가능, oauth 계정의 경우 providerAccountId로 대체)

  email: string;
  password: string;
  name: string; // 닉네임
  address?: string;
  type: "seller";

  // 회원가입 관련
  extra?: {
    providerAccountId?: string; // oauth 계정 ID
    university?: string;
    department?: string;
    studentId?: string;
    dormitory?: string;
  };
  emailVerification?: boolean;
  emailVerified?: boolean; // 이메일 인증 여부
  profileComplete?: boolean; // 프로필 완성 여부 (학교 정보, 이메일 인증 등)
  // 기존 필드들
  loginType?: "email" | "kakao" | "google";
  image?: string;
  token?: {
    accessToken: string; // 액세스 토큰
    refreshToken: string; // 리프레시 토큰
  };
  posts?: number; // 사용자가 작성한 게시글 수
  bookmark?: {
    products?: number;
    users?: number;
    posts?: number;
  }; // 사용자가 북마크한 정보
  createdAt: string; // 생성일
  updatedAt: string; // 수정일
}
