import type { Metadata } from "next";
import MyPostClient from "./MyPostClient";

// SEO를 위한 메타 데이터
export const metadata: Metadata = {
  title: "UniStuff | 내 거래 목록",
  description: "내가 작성한 판매, 구매, 공동구매 게시글을 모두 확인하고 관리",
};

export default function MyPostPage() {
  return (
    <>
      <h1 className="sr-only">내 거래 목록</h1> {/* 스크린 리더 사용자를 위한 제목 */}
      <MyPostClient />
    </>
  );
}
