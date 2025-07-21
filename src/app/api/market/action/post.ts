import { type ApiResPromise, type Post } from "@/types";

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
