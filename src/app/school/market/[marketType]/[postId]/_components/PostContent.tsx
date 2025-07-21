"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import CommentList from "./CommentList";
import { Post } from "@/types";
import { getImageUrl } from "@/app/api/market/action/file";
import { deletePost } from "@/app/api/market/action/post";

interface PostContentProps {
  post: Post;
}

export default function PostContent({ post }: PostContentProps) {
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
  return (
    <div className="min-w-[320px] max-w-[480px] mx-auto px-4 py-6 min-h-screen bg-uni-white">
      {/* 이미지 */}
      <div className="rounded-lg overflow-hidden mb-4 bg-uni-gray-100">
        {post?.image ? (
          <Image
            src={getImageUrl(post.image)}
            alt={post.title}
            width={350}
            height={300}
            className="w-full h-auto object-cover"
            unoptimized={true}
          />
        ) : (
          <div className="w-full h-[300px] bg-uni-gray-100 rounded-lg mb-4" />
        )}
      </div>

      {/* 제목 + 좋아요 */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-bold text-22">{post?.title}</h2>
        <button>❤️</button>
      </div>

      {isMyPost && (
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
      )}

      {/* 가격 */}
      <p className="text-14 text-uni-gray-400 mb-4">
        {post?.extra?.price != null ? `${Number(post?.extra.price).toLocaleString()}원` : "가격 정보 없음"}
      </p>

      {/* 작성자 */}
      <div className="flex items-center gap-3 mb-2">
        <Image src="/img/profile.png" alt="" width={56} height={56} className="rounded-full" />
        <div>
          <p className="text-16">{post?.user.name}</p>
          <p className="text-14 text-uni-gray-300">{post?.extra.location}</p>
        </div>
      </div>

      {/* 상태 */}
      <span className="inline-block px-3 py-1 bg-uni-green-400 text-uni-white text-14 font-bold rounded-[12px] mb-4 p-10">
        {post?.extra.crt}
      </span>

      {/* 설명 */}
      <p className="text-gray-700 mb-2">{post?.content}</p>
      <p className="text-12 text-uni-gray-400 mb-6">{post?.createdAt}</p>
      <CommentList _id={post._id} />
    </div>
  );
}
