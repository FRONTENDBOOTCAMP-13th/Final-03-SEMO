"use client";

import { deleteReply } from "@/data/actions/post";
import { PostReply } from "@/types";
import { useActionState, useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function CommentDeleteForm({ reply }: { reply: PostReply }) {
  const { _id } = useParams();
  const [accessToken, setAccessToken] = useState<string>("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [state, formAction, isLoading] = useActionState(deleteReply, null);
  console.log(state, isLoading);

  useEffect(() => {
    const user = localStorage.getItem("user"); // user의 정보를 로컬스토리지에서 가져옴
    const token = localStorage.getItem("accessToken"); // user의 토큰을 가져옴

    if (user) {
      // user의 정보를 currentUser에 저장
      setCurrentUser(JSON.parse(user));
    }
    if (token) {
      //
      setAccessToken(token);
    }
  }, []);

  const handleDeleteSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) {
      e.preventDefault();
      return;
    }
  };

  const isMyReply = currentUser?._id === reply.user._id;
  // 현재 로그인한 사용자의 ID와 게시글 작성자 ID 비교
  // 같으면 true, 다르면 false를 반환하여 버튼을 보여줄지 말지 결정

  // 내 게시글이 아니면 버튼 표시하지 않음
  if (!isMyReply) return null;

  return (
    <form action={formAction} onSubmit={handleDeleteSubmit} className="inline ml-2">
      <input type="hidden" name="accessToken" value={accessToken} />
      <input type="hidden" name="_id" value={_id} />
      <input type="hidden" name="replyId" value={reply._id} />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded-lg text-14 hover:bg-blue-600 transition-colors"
      >
        댓글 삭제
      </button>
    </form>
  );
}
