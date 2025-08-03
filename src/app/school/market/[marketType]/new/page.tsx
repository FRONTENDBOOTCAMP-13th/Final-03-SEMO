import { Metadata } from "next";
// import PostForm from "./_components/PostForm";
import PostForm from "@/app/school/market/_components/_PostComponents/PostForm";
import MarketPageHeader from "@/app/school/market/_components/MarketPageHeader";
import { PostType } from "@/types";

export const metadata: Metadata = {
  title: "UniStuff | 게시글 작성",
  description: "Market 게시글 작성 페이지입니다.",
};

/**
 * 상품 등록 user flow
 * 1. 유저가 플로팅 버튼 클릭시 /school/market/sell or buy/new로 이동
 * 2. PostForm 컴포넌트 게시글 작성 폼 렌더링
 * + 사진 업로드 클릭시 imgUpdate.tsx를 통해 action/file가 사진을 서버에 저장하고 주소 알려줌
 * 3. 유저가 등록 버튼 클릭시 PostForm.tsx의 handleSubmit 함수가 호출됨
 * + action/post.ts의 createPost가 서버에 상품 정보를 저장
 * 4. 서버가 응답하면 유저는 다시 상품 목록 페이지로 이동
 */

interface NewPageProps {
  params: Promise<{ marketType: string }>;
}

export default async function NewPage({ params }: NewPageProps) {
  const { marketType } = await params;
  const validMarketType = marketType as PostType;
  return (
    <>
      <MarketPageHeader />
      <PostForm mode="create" marketType={validMarketType} />
    </>
  );
}
