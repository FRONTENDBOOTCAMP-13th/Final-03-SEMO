"use client";

import { useActionState, useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { addPostLike } from "@/data/actions/bookmarks";
import { useUserStore } from "@/store/userStore";

interface PostLikeButtonProps {
  postId: number;
  initialLiked?: boolean; // 초기 좋아요 상태
}

export default function PostLikeButton({ postId, initialLiked = false }: PostLikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [state, formAction, isLoading] = useActionState(addPostLike, null);
  // store 토큰 전역 관리
  const { user } = useUserStore();
  console.log("=== PostLikeButton 확인 ===");
  console.log("postId:", postId);
  console.log("initialLiked:", initialLiked);
  console.log("liked state:", liked);

  useEffect(() => {
    if (state?.ok === 1) {
      setLiked(true);
    } else if (state?.ok === 0) {
      setLiked(initialLiked);
    }
  }, [state, initialLiked]);

  const handleSubmit = () => {
    // 즉시 UI 업데이트 (낙관적 업데이트)
    setLiked(!liked);
  };
  console.log(state, isLoading);

  return (
    <form action={formAction} onSubmit={handleSubmit}>
      {/* 숨겨진 필드들 */}
      <input type="hidden" name="target_id" value={postId} />
      <input type="hidden" name="accessToken" value={user?.token?.accessToken} />
      <input type="hidden" name="memo" value="좋아요한 게시글" />

      {/* 좋아요 버튼 */}
      <button type="submit" className="flex items-center gap-1">
        <Heart size={24} className={`${liked ? "text-uni-red-500 fill-uni-red-500" : "text-gray-400"}`} />
      </button>
    </form>
  );
}
