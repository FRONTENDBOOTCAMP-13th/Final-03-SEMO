import { Metadata } from "next";
// import PostForm from "./_components/PostForm";
import PostForm from "@/app/school/market/[marketType]/_components/PostForm";

export const metadata: Metadata = {
  title: "UniStuff | 게시글 작성",
  description: "Market 게시글 작성 페이지입니다.",
};

interface NewPageProps {
  params: Promise<{ marketType: string }>; // ← 타입 추가
}

export default async function NewPage({ params }: NewPageProps) {
  const { marketType } = await params;
  return <PostForm mode="create" marketType={marketType} />;
}
