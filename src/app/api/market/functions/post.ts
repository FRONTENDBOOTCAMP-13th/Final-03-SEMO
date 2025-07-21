import { ApiResPromise, Post, PostReply } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || "";

/**
 * 게시판 타입에 해당하는 게시글 목록을 가져옵니다.
 * @param {string} boardType - 게시판 타입(예: notice, free 등)
 * @returns {Promise<ApiRes<Post[]>>} - 게시글 목록 응답 객체
 */
export async function getPosts(boardType: string): ApiResPromise<Post[]> {
  try {
    const res = await fetch(`${API_URL}/posts?type=${boardType}`, {
      headers: {
        "Client-Id": CLIENT_ID,
      },
      cache: "force-cache",
    });
    return res.json();
  } catch (error) {
    // 네트워크 오류 처리
    console.error(error);
    return { ok: 0, message: "일시적인 네트워크 문제로 등록에 실패했습니다." };
  }
}

/**
 * 특정 게시글의 상세 정보를 가져옵니다.
 * @param {number} _id - 게시글의 고유 ID
 * @returns {Promise<ApiRes<Post>>} - 게시글 상세 정보 응답 객체
 */
export async function getPost(_id: number): ApiResPromise<Post> {
  try {
    const res = await fetch(`${API_URL}/posts/${_id}`, {
      headers: {
        "Client-Id": CLIENT_ID,
      },
      cache: "force-cache",
    });
    return res.json();
  } catch (error) {
    // 네트워크 오류 처리
    console.error(error);
    return { ok: 0, message: "일시적인 네트워크 문제로 등록에 실패했습니다." };
  }
}

/**
 * 특정 게시글의 댓글 목록을 가져옵니다.
 * @param {number} _id - 게시글의 고유 ID
 * @returns {Promise<ApiRes<PostReply[]>>} - 댓글 목록 응답 객체
 * @Description 게시글 번호를 받아 해당하는 게시글의 댓글 목록을 가져옴
 */
export async function getReplies(_id: number, retryCount = 0): ApiResPromise<PostReply[]> {
  const MAX_RETRIES = 10;
  try {
    const res = await fetch(`${API_URL}/posts/${_id}/replies`, {
      headers: {
        "Client-Id": CLIENT_ID,
      },
    });
    if (!res.ok && retryCount < MAX_RETRIES) {
      console.warn(`댓글 목록 가져오기 실패, 재시도 ${retryCount + 1}/${MAX_RETRIES}`);
      return getReplies(_id, retryCount + 1);
    }
    return res.json();
  } catch (err) {
    console.error(err);
    return { ok: 0, message: "일시적인 네트워크 문제로 등록에 실패" };
  }
}
