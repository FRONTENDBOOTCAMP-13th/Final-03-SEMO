import { type ApiResPromise, type ApiRes, type Post } from "@/types";
import { revalidatePath } from "next/cache";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || "";

/**
 * 게시글 작성 함수
 * @param postData - 게시글 데이터 객체
 * @returns 게시글 작성 결과를 반환하는 Promise
 */
export async function createPost(postData: {
  type: string;
  title: string;
  content: string;
  image: string;
  extra: {
    category: string;
    price: string;
    location: string;
  };
}): ApiResPromise<Post> {
  const accessToken = localStorage.getItem("accessToken");
  const res = await fetch(`${API_URL}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Client-Id": CLIENT_ID,
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(postData),
  });

  return res.json();
}

/**
 * 게시글 수정 함수
 * @param postId - 수정할 게시글 ID
 * @param postData - 수정할 게시글 데이터 객체
 * @returns 게시글 수정 결과를 반환하는 Promise
 */
export async function updatePost(
  postId: string,
  postData: {
    type: string;
    title: string;
    content: string;
    image: string;
    extra: {
      category: string;
      price: string;
      location: string;
    };
  }
): ApiResPromise<Post> {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("로그인이 필요합니다.");
  }

  const res = await fetch(`${API_URL}/posts/${postId}`, {
    method: "PATCH", // 수정은 PATCH 메서드
    headers: {
      "Content-Type": "application/json",
      "Client-Id": CLIENT_ID,
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(postData),
  });

  return res.json();
}

/**
 * 게시글 삭제 함수
 * @param postId - 삭제할 게시글 Id
 *
 */

export async function deletePost(postId: string | number): ApiResPromise<Post> {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    throw new Error("로그인이 필요합니다.");
  }
  const res = await fetch(`${API_URL}/posts/${postId}`, {
    method: "DELETE",
    headers: {
      "Client-Id": CLIENT_ID,
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return res.json();
}

/**
 * 댓글을 생성하는 함수
 * @param {ApiRes<PostReply> | null} state - 이전 상태(사용하지 않음)
 * @param {FormData} formData - 댓글 정보를 담은 FormData 객체
 * @returns {Promise<ApiRes<PostReply>>} - 생성 결과 응답 객체
 * @description
 * 댓글을 생성하고, 성공 시 해당 게시글의 댓글 목록을 갱신합니다.
 */

export async function createReply(state: ApiRes<Post[]> | null, formData: FormData): ApiResPromise<Post[]> {
  const body = Object.fromEntries(formData.entries());
  // 폼 데이터 객체로 변환 FormData -> {content: '하이', _id:523}
  const accessToken = localStorage.getItem("accessToken");
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
  } catch (err) {
    console.log(err);
    return { ok: 0, message: "일시적인 네트워크 문제로 등록에 실패하였습니다." };
  }
  if (data.ok) {
    revalidatePath(`/market/${body._id}`);
  }
  return data;
}
