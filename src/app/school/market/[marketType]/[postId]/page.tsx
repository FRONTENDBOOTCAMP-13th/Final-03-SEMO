"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import CommentList from "./_components/CommentList";
import { Post } from "@/types";

interface PostDetail {
  title: string;
  content: string;
  image: string;
  extra: {
    price: number;
    name: string;
    dormitory: string;
    profileImage: string;
  };
  status: string;
  createdAt: string;
}

export default function MarketDetailPage() {
  const { marketType, postId } = useParams<{ marketType: string; postId: string }>();
  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}`, {
          headers: { "Client-Id": process.env.NEXT_PUBLIC_CLIENT_ID! },
        });
        const json = await res.json();
        if (json.ok === 1) {
          setPost(json.item);
        } else {
          console.error("조회 실패:", json.message);
        }
      } catch (e) {
        console.error("API 호출 에러:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [postId]);

  if (loading) return <div className="py-10 text-center">로딩 중...</div>;
  if (!post) return <div className="py-10 text-center">게시글을 찾을 수 없습니다.</div>;

  return (
    <div className="min-w-[320px] max-w-[480px] mx-auto px-4 py-6 min-h-screen bg-uni-white">
      {/* 이미지 */}
      <div className="rounded-lg overflow-hidden mb-4 bg-uni-gray-100">
        <Image src={post.image} alt={post.title} width={350} height={300} className="w-full h-auto object-cover" />
      </div>

      {/* 제목 + 좋아요 */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-bold text-22">{post.title}</h2>
        <button>❤️</button>
      </div>

      {/* 가격 */}
      <p className="text-14 text-uni-gray-400 mb-4">
        {post.extra?.price != null ? `${post.extra.price.toLocaleString()}원` : "가격 정보 없음"}원
      </p>

      {/* 작성자 */}
      <div className="flex items-center gap-3 mb-2">
        <Image src="/img/profile.png" alt="" width={56} height={56} className="rounded-full" />
        <div>
          <p className="text-16">{post.extra.name}</p>
          <p className="text-14 text-uni-gray-300">{post.extra.dormitory}</p>
        </div>
      </div>

      {/* 상태 */}
      <span className="inline-block px-3 py-1 bg-uni-green-400 text-uni-white text-14 font-bold rounded-[12px] mb-4 p-10">
        {post.status}
      </span>

      {/* 설명 */}
      <p className="text-gray-700 mb-2">{post.content}</p>
      <p className="text-12 text-uni-gray-400 mb-6">{post.createdAt}</p>
      <CommentList />
    </div>
  );
}
