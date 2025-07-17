"use server";

import { ApiRes, ApiResPromise, Post } from "@/types";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || "";

/**
 * 게시글을 생성하는 함수
 * @param {ApiRes<Post> | null} state - 이전 상태(사용하지 않음)
 * @param {FormData} formData - 게시글 정보를 담은 FormData 객체
 * @returns {Promise<ApiRes<Post>>} - 생성 결과 응답 객체
 * @throws {Error} - 네트워크 오류 발생 시
 * @description
 * 게시글을 생성하고, 성공 시 해당 게시판으로 리다이렉트합니다.
 * 실패 시 에러 메시지를 반환합니다.
 */

export async function createPost(state: ApiRes<Post> | null, formData: FormData): ApiResPromise<Post> {
  // FormData -> Object로 변환
  const body = Object.fromEntries(formData.entries());
  // let res = Response;
  let data: ApiRes<Post>;

  try {
    const res = await fetch(`${API_URL}/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Client-Id": CLIENT_ID,
      },
      body: JSON.stringify(body),
    });
    data = await res.json();
  } catch (err) {
    console.error(err);
    return { ok: 0, message: "등록에 실패하였습니다." };
  }
  if (data.ok) {
    revalidatePath(`/${body.type}`);
    redirect(`/${body.type}`);
  } else {
    return data;
  }
}
