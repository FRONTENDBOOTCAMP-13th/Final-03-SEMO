"use server";
import { type ApiResPromise, type ApiRes, type Post, type PostReply } from "@/types";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || "";

/**
 * 게시글 작성 함수
 * @param postData - 게시글 데이터 객체
 * @returns 게시글 작성 결과를 반환하는 Promise
 */
export async function createPost(state: ApiRes<Post> | null, formData: FormData): ApiResPromise<Post> {
  const accessToken = formData.get("accessToken") as string;
  const type = formData.get("type") as string;

  if (!accessToken) {
    return { ok: 0, message: "로그인이 필요합니다." };
  }

  // FormData에서 데이터 추출
  const postData = {
    type,
    title: formData.get("title") as string,
    content: formData.get("content") as string,
    image: formData.get("image") as string,
    extra: {
      category: formData.get("category") as string,
      price: formData.get("price") as string,
      location: formData.get("location") as string,
    },
  };
  let result: any;
  try {
    const res = await fetch(`${API_URL}/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Client-Id": CLIENT_ID,
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(postData),
    });
    result = await res.json();
  } catch (error) {
    console.error("게시글 작성 오류:", error);
    return { ok: 0, message: "게시글 작성 중 오류가 발생했습니다." };
  }
  if (result.ok === 1) {
    // 캐시 무효화
    revalidateTag(`posts?type=${type}`);
    // 리다이렉트
    redirect(`/school/market/${type}`);
  }
  return result;
}

/**
 * 게시글 수정 함수
 * @param postId - 수정할 게시글 ID
 * @param postData - 수정할 게시글 데이터 객체
 * @returns 게시글 수정 결과를 반환하는 Promise
 */
export async function updatePost(state: ApiRes<Post> | null, formData: FormData): ApiResPromise<Post> {
  const accessToken = formData.get("accessToken") as string;
  const postId = formData.get("postId") as string;
  const type = formData.get("type") as string;

  const postData = {
    type,
    title: formData.get("title") as string,
    content: formData.get("content") as string,
    image: formData.get("image") as string,
    extra: {
      category: formData.get("category") as string,
      price: formData.get("price") as string,
      location: formData.get("location") as string,
    },
  };

  let result: any;
  try {
    const res = await fetch(`${API_URL}/posts/${postId}`, {
      method: "PATCH", // 수정은 PATCH 메서드
      headers: {
        "Content-Type": "application/json",
        "Client-Id": CLIENT_ID,
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(postData),
    });

    result = await res.json();
  } catch (err) {
    console.error("게시글 수정 오류", err);
    return { ok: 0, message: "게시글 수정 중 오류 발생" };
  }
  if (result.ok) {
    revalidateTag(`posts/${postId}`);
    revalidateTag(`posts?type=${type}`);
    redirect(`/school/market/${type}/${postId}`);
  }
  return result;
}

/**
 * 게시글 삭제 함수
 * @param postId - 삭제할 게시글 Id
 *
 */

export async function deletePost(state: ApiRes<Post> | null, formData: FormData): ApiResPromise<Post> {
  const accessToken = formData.get("accessToken") as string;
  const postId = formData.get("postId") as string;
  const type = formData.get("type") as string;

  try {
    const res = await fetch(`${API_URL}/posts/${postId}`, {
      method: "DELETE",
      headers: {
        "Client-Id": CLIENT_ID,
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await res.json();

    if (data.ok) {
      // 캐시 무효화
      revalidateTag(`posts/${postId}`);
      revalidateTag(`posts?type=${type}`);
      // 목록 페이지로 리다이렉트
      redirect(`/school/market/${type}`);
    }
    return data;
  } catch (err) {
    console.error("게시글 삭제 오류", err);
    return { ok: 0, message: "게시글 삭제 중 오류 발생" };
  }
}

/**
 * 댓글을 생성하는 함수
 * @param {ApiRes<PostReply> | null} state - 이전 상태(사용하지 않음)
 * @param {FormData} formData - 댓글 정보를 담은 FormData 객체
 * @returns {Promise<ApiRes<PostReply>>} - 생성 결과 응답 객체
 * @description
 * 댓글을 생성하고, 성공 시 해당 게시글의 댓글 목록을 갱신합니다.
 */

export async function createReply(
  state: ApiRes<Post[]> | null,
  formData: FormData,
  retryCount = 0
): ApiResPromise<Post[]> {
  const MAX_RETRIES = 10;

  const body = Object.fromEntries(formData.entries());
  // 폼 데이터 객체로 변환 FormData -> {content: '하이', _id:523}
  const accessToken = formData.get("accessToken") as string;
  // 토큰 가져오기

  let res: Response;
  let data: ApiRes<Post[]>;

  try {
    res = await fetch(`${API_URL}/posts/${body._id}/replies`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Client-Id": CLIENT_ID,
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });
    data = await res.json();

    if (!res.ok && retryCount < MAX_RETRIES) {
      console.warn(`createReply 실패, 재시도 ${retryCount + 1}/${MAX_RETRIES}`);
      await new Promise((resolve) => setTimeout(resolve, 1000 * (retryCount + 1)));
      return createReply(state, formData, retryCount + 1);
    }
  } catch (err) {
    console.log(err);
    return { ok: 0, message: "일시적인 네트워크 문제로 등록에 실패하였습니다." };
  }
  if (data.ok) {
    revalidatePath(`/market/${body._id}`); // 해당 게시글의 댓글 목록을 갱신(캐시 무효화)
  }
  return data;
}

/**
 * 특정 게시글의 댓글 목록을 가져옵니다.
 * @param {number} _id - 게시글의 고유 ID
 * @returns {Promise<ApiRes<PostReply[]>>} - 댓글 목록 응답 객체
 */
export async function getReplies(_id: number): ApiResPromise<PostReply[]> {
  try {
    const res = await fetch(`${API_URL}/posts/${_id}/replies`, {
      headers: {
        "Client-Id": CLIENT_ID,
      },
      cache: "no-store", // 댓글은 실시간으로 업데이트되어야 하므로
    });
    return res.json();
  } catch (error) {
    // 네트워크 오류 처리
    console.error(error);
    return { ok: 0, message: "댓글을 불러오는데 실패했습니다." };
  }
}
