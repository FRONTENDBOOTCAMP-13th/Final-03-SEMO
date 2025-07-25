"use client";

import { useActionState } from "react";
import { Heart } from "lucide-react";
import { addPostLike } from "@/data/actions/bookmarks";
import { useUserStore } from "@/store/userStore";

interface PostLikeButtonProps {
  postId: number;
}

export default function PostLikeButton({ postId }: PostLikeButtonProps) {
  // const [accessToken, setAccessToken] = useState<string>("");
  const [state, formAction, isLoading] = useActionState(addPostLike, null);
  // store 토큰 전역 관리
  const { user } = useUserStore();
  console.log(state, isLoading);

  // 로그인 토큰 가져오기
  // useEffect(() => {
  //   const token = localStorage.getItem("accessToken");
  //   console.log("가져온 토큰:", token);
  //   if (token) {
  //     setAccessToken(token);
  //   }
  // }, []);

  return (
    <form action={formAction}>
      {/* 숨겨진 필드들 */}
      <input type="hidden" name="target_id" value={postId} />
      <input type="hidden" name="accessToken" value={user?.token?.accessToken} />
      <input type="hidden" name="memo" value="좋아요한 게시글" />

      {/* 좋아요 버튼 */}
      <button type="submit" className="flex items-center gap-1">
        <Heart size={24} className="text-uni-red-500" />
      </button>
    </form>
  );
}
