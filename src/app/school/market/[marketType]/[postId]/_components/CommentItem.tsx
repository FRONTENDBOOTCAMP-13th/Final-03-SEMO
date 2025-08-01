"use client";

import { PostReply, Post } from "@/types";
import Image from "next/image";
import Link from "next/link";
import CommentDeleteForm from "@/app/school/market/[marketType]/[postId]/_components/CommentDeleteForm";
// import { useUserStore } from "@/store/userStore";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || "";

interface CommentItemProps {
  reply: PostReply;
  post: Post; // 게시글 정보 필요!
}

export default function CommentItem({ reply, post }: CommentItemProps) {
  // const { user } = useUserStore();
  const isPostAuthor = reply.user._id === post.user._id; // 게시글 작성자가 쓴 댓글

  return (
    <div>
      {/* 댓글 리스트 */}
      <div className="space-y-3">
        <div className="flex gap-2 items-start">
          <Image
            src={reply.user.image ? `${API_URL}/files/${CLIENT_ID}/${reply.user.image}` : "/assets/defaultimg.png"}
            alt="{`${reply.user.name}`}"
            width={24}
            height={24}
            className="rounded-full"
          />
          <div className="flex-1">
            <p className="text-14 font-bold">
              {/* 동적 사용자 이름 */}
              <Link href="" className="text-uni-blue-400">
                {reply.user.name}
                {/* 게시글 작성자인 경우 */}
                {isPostAuthor && <span className="text-14 text-uni-blue-400 font-bold ml-0.5">(글쓴이)</span>}
              </Link>
              {/* 동적 작성 날짜 */}
              <span className="text-14 text-uni-gray-300 font-medium ml-2">
                {new Date(reply.createdAt).toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </p>
            <div className="flex justify-between item-start mb-3 py-2">
              {/* 동적 댓글 내용 */}
              <p className="text-14 flex-1 pr-2">{reply.content}</p>
              <div className="flex-shrink-0">
                <CommentDeleteForm reply={reply} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
