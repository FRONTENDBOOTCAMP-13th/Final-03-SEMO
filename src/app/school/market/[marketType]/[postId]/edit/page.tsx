// 게시글 수정
import PostForm from "@/app/school/market/_components/_PostComponents/PostForm";
import { getPost } from "@/app/api/market/functions/post";
import { PostType } from "@/types";
import MarketPageHeader from "../../../_components/MarketPageHeader";

interface EditPageProps {
  params: Promise<{ marketType: string; postId: string }>;
}

/**
 * 상품 수정 user flow
 * 1. 유저가 상품 상세 페이지에서 수정 버튼 클릭
 * + /school/market/sell or buy/[postId]/edit로 이동
 * 2. [postId]/edit/page.tsx를 통해 해당 상품 상세 정보 가져옴
 * 3. PostForm 컴포넌트에서 mode를 'edit'으로 설정하면 prop를 통해 기존 게시글 데이터가 전달됨
 * 4. 유저가 수정 완료 후 등록 버튼 클릭시 PostForm.tsx의 handleSubmit 함수가 호출됨
 * + action/post.ts의 updatePost가 서버에 수정된
 */

export default async function EditPage({ params }: EditPageProps) {
  const { marketType, postId } = await params;

  // 기존 게시글 데이터 가져오기
  const response = await getPost(Number(postId));

  if (!response.ok) {
    return (
      <div className="min-w-[320px] max-w-[480px] mx-auto px-4 py-6 min-h-screen bg-uni-white flex items-center justify-center">
        <p className="text-uni-gray-400">게시글을 찾을 수 없습니다.</p>
      </div>
    );
  }

  const post = response.item;

  return (
    <>
      <MarketPageHeader />
      <PostForm mode="edit" initialData={post} marketType={marketType as PostType} postId={postId} />;
    </>
  );
}
