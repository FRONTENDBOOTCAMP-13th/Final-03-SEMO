import { ApiResPromise, Post, PostReply } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || "";

// /**
//  * 게시판 타입에 해당하는 게시글 목록을 가져옵니다.
//  * @param {string} boardType - 게시판 타입(예: notice, free 등)
//  * @returns {Promise<ApiRes<Post[]>>} - 게시글 목록 응답 객체
//  */
export async function getPosts(boardType: string, page: number = 1, limit: number = 6): ApiResPromise<Post[]> {
  try {
    const res = await fetch(`${API_URL}/posts?type=${boardType}&page=${page}&limit=${limit}`, {
      headers: {
        "Client-Id": CLIENT_ID,
      },
      // cache: "no-cache",
      next: { revalidate: 15 },
    });
    return res.json();
  } catch (error) {
    // 네트워크 오류 처리
    console.error(error);
    return { ok: 0, message: "일시적인 네트워크 문제로 등록에 실패했습니다." };
  }
}

/**
 * @Params {stirng} borderType - 게시판 타입
 * @returns {Promise<number>} - 전체 게시글 수
 */
export async function getPostsCount(boardType: string): Promise<number> {
  try {
    // 첫 페이지를 가져와서 총 개수 확인 (API가 총 개수를 제공한다면)
    const res = await fetch(`${API_URL}/posts?type=${boardType}&page=1&limit=1`, {
      headers: {
        "Client-Id": CLIENT_ID,
      },
      // cache: "no-cache",
      next: { revalidate: 180 },
    });

    const data = await res.json();
    if (data.totalCount) {
      return data.totalCount;
    }

    // 아니면 추정치 계산 (임시)
    return data.item ? data.item.length * 100 : 0; // 임시로 추정
  } catch (error) {
    console.error(error);
    return 0;
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
      cache: "no-cache",
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
      cache: "no-cache",
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

/**
 * 키워드 타입에 맞는 게시글 목록을 가져옵니다.
 * @param {string} type - 게시판 타입(buy | sell)
 * @param {string | null} keyword - 검색 키워드
 * @returns {Promise<ApiRes<Post[]>>} 게시글 목록 응답 객체
 */
export async function getKeywordPosts(
  type: "buy" | "sell" | "groupPurchase",
  keyword: string | null,
  page: number = 1,
  limit: number = 10
): ApiResPromise<Post[]> {
  try {
    // keyword가 null이거나 빈 문자열인 경우 처리
    if (!keyword || !keyword.trim()) {
      return { ok: 0, message: "검색 키워드를 입력해주세요." };
    }

    const urlParams = new URLSearchParams({
      type: type,
      page: page.toString(),
      limit: limit.toString(),
    });

    if (keyword) {
      urlParams.append("keyword", keyword.trim());
    }

    console.log("검색 URL: ", `${API_URL}/posts?${urlParams.toString()}`);

    const res = await fetch(`${API_URL}/posts?${urlParams.toString()}`, {
      method: "GET", // 선택사항: GET은 기본값이므로 생략 가능
      headers: {
        "Client-Id": CLIENT_ID,
      },
      cache: "no-cache", // 검색은 실시간 데이터
    });

    // 응답 상태 확인
    if (!res.ok) {
      console.error("HTTP 오류:", res.status, res.statusText);
      return { ok: 0, message: "서버에서 데이터를 가져오는데 실패했습니다." };
    }

    const data = await res.json();
    return data;
  } catch (error) {
    // 네트워크 오류 처리
    console.error("검색 중 오류 발생:", error);
    return { ok: 0, message: "일시적인 네트워크 문제로 검색에 실패했습니다." };
  }
}
