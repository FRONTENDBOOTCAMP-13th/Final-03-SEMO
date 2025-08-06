import type { Metadata } from "next";
import MyPageClient from "./MyPageClient";

// SEO를 위한 메타 데이터
export const metadata: Metadata = {
  title: "UniStuff | 마이페이지",
  description: "나의 거래 내역, 찜한 목록, 거래 후기 등 모든 활동을 확인하고 프로필을 관리",
};

export default function MyPage() {
  return (
    <main>
      <h1 className="sr-only">마이페이지</h1> {/* 스크린 리더 사용자를 위한 제목 */}
      <MyPageClient />
    </main>
  );
}
