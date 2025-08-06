"use client";

import { deleteReply } from "@/data/actions/post";
import { PostReply } from "@/types";
import { useActionState, useEffect } from "react";
import { useUserStore } from "@/store/userStore";
import { useParams } from "next/navigation";

export default function CommentDeleteForm({ reply }: { reply: PostReply }) {
  const params = useParams();
  const postId = params.postId as string;
  const [state, formAction, isLoading] = useActionState(deleteReply, null);
  // store 토큰 전역 관리
  const { user } = useUserStore();
  console.log(state, isLoading);

  // 삭제 결과 처리
  useEffect(() => {
    if (state?.ok === 1) {
      alert("댓글이 삭제되었습니다.");
    } else if (state?.ok === 0) {
      alert(`삭제 실패: ${state.message}`);
    }
  }, [state]);

  const handleDeleteSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (!postId) {
      alert("게시글 정보를 찾을 수 없습니다.");
      e.preventDefault();
      return;
    }
    if (!window.confirm("정말 삭제하시겠습니까?")) {
      e.preventDefault();
      return;
    }
  };

  const isMyReply = user?._id === reply.user._id;
  // 현재 로그인한 사용자의 ID와 게시글 작성자 ID 비교
  // 같으면 true, 다르면 false를 반환하여 버튼을 보여줄지 말지 결정

  // 내 게시글이 아니면 버튼 표시하지 않음
  if (!user || !isMyReply) return null;

  return (
    <form action={formAction} onSubmit={handleDeleteSubmit} className="inline ml-2 -top-2">
      <input type="hidden" name="accessToken" value={user?.token?.accessToken ?? ""} />
      <input type="hidden" name="_id" value={postId} />
      <input type="hidden" name="replyId" value={reply._id} />
      <button type="submit" className="px-3 -top-21 text-13 text-uni-gray-700 !cursor-pointer">
        삭제
      </button>
    </form>
  );
}
