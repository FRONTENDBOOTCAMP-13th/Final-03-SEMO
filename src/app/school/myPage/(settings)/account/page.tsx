import type { Metadata } from "next";
import AccountForm from "./AccountForm";

// SEO를 위한 메타 데이터
export const metadata: Metadata = {
  title: "UniStuff | 계정 설정",
  description: "프로필 이미지, 이름, 계좌번호 등 내 계정 정보를 수정하고 관리",
};

export default function MyPageAccount() {
  return (
    <main>
      <h1 className="sr-only">계정 설정</h1> {/* 스크린 리더 사용자를 위한 제목 */}
      <AccountForm />
    </main>
  );
}
