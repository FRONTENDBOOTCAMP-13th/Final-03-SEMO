"use server";

import { type ApiResPromise } from "@/types";
import { type PostLike } from "@/types/like";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || "";

/**
 * 게시글 좋아요 추가 함수
 * @param state - 이전 상태 (useActionState용)
 * @param formData - 폼 데이터
 * @returns 게시글 좋아요 추가 결과
 */

export async function addPostLike(state: any, formData: FormData): ApiResPromise<PostLike> {
  const target_id = formData.get("target_id") as string;
  const accessToken = formData.get("accessToken") as string;
  const memo = formData.get("memo") as string;

  console.log("=== 게시글 좋아요 추가 시작 ===");
  console.log("게시글 ID:", target_id);
  console.log("accessToken:", accessToken ? "있음" : "없음");
  console.log("메모:", memo);

  try {
    const requestBody = {
      target_id: Number(target_id),
      memo,
      extra: {
        type: "POST" as const,
      },
    };

    const res = await fetch(`${API_URL}/bookmarks/post`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Client-Id": CLIENT_ID,
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(requestBody),
    });
    const data = await res.json();

    if (!res.ok) {
      return { ok: 0, message: data.message || "서버 오류가 발생했습니다." };
    }
    return data;
  } catch (err) {
    console.error(err);
    return { ok: 0, message: "네트워크 오류로 좋아요에 실패했습니다." };
  }
}
