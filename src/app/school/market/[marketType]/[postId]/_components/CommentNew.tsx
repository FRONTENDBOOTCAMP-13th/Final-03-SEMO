"use client";
import { createReply } from "@/app/api/market/action/post";
import { useActionState, useState, useEffect } from "react";

interface CommentNewProps {
  _id: number;
}

export default function CommentNew({ _id }: CommentNewProps) {
  const [state, formAction, isLoading] = useActionState(createReply, null);
  const [accessToken, setAccessToken] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setAccessToken(token);
    }
  }, []);

  console.log(isLoading, state);

  return (
    <div className="min-w-[320px] max-w-[480px]">
      {/* 댓글 작성 폼 */}
      <div className="mb-4">
        <form action={formAction}>
          {/* 숨겨진 게시글 ID */}
          <input type="hidden" name="_id" value={_id} />
          <input type="hidden" name="accessToken" value={accessToken} />

          {/* 댓글 입력 필드 */}
          <div className="mb-4">
            <textarea
              name="content"
              placeholder="댓글을 입력하세요"
              className="w-full bg-uni-gray-200 rounded-md p-3 text-16 resize-none"
              rows={3}
            />

            {/* 에러 메시지 표시 */}
            {state?.ok === 0 && state.errors?.content?.msg && (
              <p className="mt-2 text-sm text-red-500">{state.errors.content.msg}</p>
            )}
          </div>

          {/* 등록 버튼 */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-uni-blue-400 text-uni-white px-4 py-2 rounded-lg text-14 hover:bg-uni-blue-500 disabled:bg-uni-gray-400 transition-colors"
            >
              {isLoading ? "등록 중..." : "댓글 등록"}
            </button>
          </div>
        </form>

        {/* 일반적인 에러 메시지 */}
        {state?.ok === 0 && state.message && !state.errors && (
          <p className="mt-2 text-sm text-red-500">{state.message}</p>
        )}
      </div>
    </div>
  );
}
