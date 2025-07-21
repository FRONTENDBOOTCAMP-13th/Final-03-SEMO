// 게시글 수정
import PostForm from "@/app/school/market/[marketType]/_components/PostForm";
import { getPost } from "@/app/api/market/functions/post";

interface EditPageProps {
  params: Promise<{ marketType: string; postId: string }>;
}

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

  return <PostForm mode="edit" initialData={post} marketType={marketType} postId={postId} />;
}
