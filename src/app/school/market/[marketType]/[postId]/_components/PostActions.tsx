"use client";

import { useRouter } from "next/navigation";
import { useActionState, useState, useEffect } from "react";
import { Post } from "@/types";
// import { deletePost } from "@/action/post";
import { deletePost } from "@/data/actions/post";

interface PostActionsProps {
  post: Post;
}

export default function PostActions({ post }: PostActionsProps) {
  const router = useRouter();
  const [accessToken, setAccessToken] = useState<string>("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [state, formAction, isLoading] = useActionState(deletePost, null);
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

  useEffect(() => {
    if (state?.ok === 1) {
      console.log("삭제 성공");
      const marketType = post?.type || "buy";
      window.location.href = `/school/market/${marketType}`;
    }
  }, [state, post?.type]);

  if (!post || !post.user) {
    return null; // post나 post.user가 없으면 아무것도 렌더링하지 않음
  }

  const handleEdit = () => {
    // 수정 페이지로 이동
    router.push(`/school/market/${post.type}/${post._id}/edit`);
  };

  const handleDeleteSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) {
      e.preventDefault();
      return;
    }
  };

  const isMyPost = currentUser?._id === post.user._id;
  // 현재 로그인한 사용자의 ID와 게시글 작성자 ID 비교
  // 같으면 true, 다르면 false를 반환하여 버튼을 보여줄지 말지 결정

  // 내 게시글이 아니면 버튼 표시하지 않음
  if (!isMyPost) return null;

  return (
    <div className="flex gap-2 mb-4">
      <section
        onClick={handleEdit}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg text-14 hover:bg-blue-600 transition-colors"
      >
        수정
      </section>
      <form action={formAction} onSubmit={handleDeleteSubmit} className="inline">
        {/* <form action={deleteAction} className="inline"> */}
        <input type="hidden" name="accessToken" value={accessToken} />
        <input type="hidden" name="postId" value={post._id} />
        <input type="hidden" name="type" value={post.type} />

        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg text-14 hover:bg-blue-600 transition-colors"
        >
          삭제
        </button>
      </form>
    </div>
  );
}
