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
  const res = await fetch(`${API_URL}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Client-Id": CLIENT_ID,
    },
    body: JSON.stringify(postData),
  });

  return res.json();
}
