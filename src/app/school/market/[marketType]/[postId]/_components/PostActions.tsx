"use client";

import { useRouter } from "next/navigation";
import { Post } from "@/types";
import { deletePost } from "@/app/api/market/action/post";

interface PostActionsProps {
  post: Post;
}

export default function PostActions({ post }: PostActionsProps) {
  const router = useRouter();

  // 임시: 내 게시글인지 확인 (실제로는 localStorage의 currentUser와 비교)
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const isMyPost = currentUser._id === post.user._id;

  const handleEdit = () => {
    // 수정 페이지로 이동
    router.push(`/school/market/${post.type}/${post._id}/edit`);
  };

  const handleDelete = async () => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    try {
      const res = await deletePost(post._id.toString());
      if (res.ok) {
        console.log("게시글이 삭제되었습니다.");
        router.push(`/school/market/${post.type}`);
      } else {
        console.log("게시글 삭제에 실패했습니다.");
      }
    } catch (err) {
      console.error("게시글 삭제 중 오류 발생:", err);
    }
  };
  if (!isMyPost) return null;
  return (
    <div className="flex gap-2 mb-4">
      <button
        onClick={handleEdit}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg text-14 hover:bg-blue-600 transition-colors"
      >
        수정
      </button>
      <button
        onClick={handleDelete}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg text-14 hover:bg-blue-600 transition-colors"
      >
        삭제
      </button>
    </div>
  );
}
