"use client";
import { createReply } from "@/data/actions/post";
// import { useActionState, useState, useEffect } from "react";
import { useActionState } from "react";
import { useUserStore } from "@/store/userStore";
import { MessageCircle } from "lucide-react";

interface CommentNewProps {
  _id: number;
}

export default function CommentNew({ _id }: CommentNewProps) {
  const [state, formAction, isLoading] = useActionState(createReply, null);
  // store 토큰 전역 관리
  const { user } = useUserStore();

  console.log(isLoading, state);

  return (
    <section className="min-w-[320px] max-w-[480px]" aria-labelledby="comment-form-title">
      {/* 댓글 작성 폼 */}
      <div className="mb-4">
        <h3 id="comment-form-title" className="sr-only">
          새 댓글 작성
        </h3>
        <form action={formAction} role="form" aria-label="댓글 작성 폼">
          {/* 숨겨진 게시글 ID */}
          <input type="hidden" name="_id" value={_id} />
          <input type="hidden" name="accessToken" value={user?.token?.accessToken ?? ""} />

          {/* 댓글 입력 필드 */}
          <fieldset className="flex gap-3 items-start mb-4">
            <legend className="sr-only">댓글 내용 입력</legend>
            <label htmlFor={`comment-textarea-${_id}`} className="sr-only">
              댓글 내용
            </label>
            <textarea
              id={`comment-textarea-${_id}`}
              name="content"
              placeholder="댓글을 입력하세요"
              className="w-full h-13 bg-uni-gray-200 rounded-lg p-3 text-16 resize-none"
              rows={3}
            />

            {/* 에러 메시지 표시 */}
            {state?.ok === 0 && state.errors?.content?.msg && (
              <p className="mt-2 text-sm text-red-500">{state.errors.content.msg}</p>
            )}

            {/* 등록 버튼 */}
            <button
              type="submit"
              disabled={isLoading}
              className="bg-uni-blue-400 text-uni-white h-13 px-4 py-2 rounded-lg text-14"
              aria-label={isLoading ? "댓글 등록 중..." : "댓글 등록"}
            >
              <MessageCircle size={22} />
            </button>
          </fieldset>
        </form>

        {/* 일반적인 에러 메시지 */}
        {state?.ok === 0 && state.message && !state.errors && (
          <p className="mt-2 text-sm text-red-500">{state.message}</p>
        )}
      </div>
    </section>
  );
}
