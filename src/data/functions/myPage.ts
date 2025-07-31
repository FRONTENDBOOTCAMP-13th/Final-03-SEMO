import { ApiRes, ApiResPromise } from "@/types";
import { BookmarkResponse, BookmarkItem, OrderItem, PostItem, UserResponse } from "@/types/myPageApi";
import { User } from "@/types/user";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || "";

/**
 * 사용자 정보를 가져옵니다.
 * @param {number} userId - 사용자 ID
 * @returns {Promise<ApiRes<User>>} - 사용자 정보 응답 객체
 */
export async function getUser(userId: number): ApiResPromise<User> {
  try {
    const res = await fetch(`${API_URL}/users/${userId}`, {
      headers: {
        "Client-Id": CLIENT_ID,
      },
      cache: "force-cache",
      next: {
        tags: [`users/${userId}`],
      },
    });
    return res.json();
  } catch (error) {
    console.error(error);
    return { ok: 0, message: "일시적인 네트워크 문제로 사용자 정보를 불러올 수 없습니다." };
  }
}

/**
 * 여러 사용자 정보를 한번에 가져옵니다 (캐시 최적화)
 * @param {number[]} userIds - 사용자 ID 배열
 * @returns {Promise<ApiRes<User[]>>} - 사용자 목록 응답 객체
 */
export async function getUsers(userIds: number[]): ApiResPromise<User[]> {
  try {
    // 중복 제거
    const uniqueUserIds = [...new Set(userIds)];

    const res = await fetch(`${API_URL}/users?_id=${uniqueUserIds.join(",")}`, {
      headers: {
        "Client-Id": CLIENT_ID,
      },
      cache: "force-cache",
      next: {
        tags: [`users-bulk`, ...uniqueUserIds.map((id) => `users/${id}`)],
      },
    });
    return res.json();
  } catch (error) {
    console.error(error);
    return { ok: 0, message: "일시적인 네트워크 문제로 사용자 목록을 불러올 수 없습니다." };
  }
}

/**
 * 사용자 프로필 캐시 Map (클라이언트 사이드 캐시)
 */
const userProfileCache = new Map<number, { user: User; timestamp: number }>();
const CACHE_DURATION = 10 * 60 * 1000; // 10분

/**
 * 캐시된 사용자 정보를 가져옵니다 (클라이언트 사이드 최적화)
 * @param {number} userId - 사용자 ID
 * @returns {Promise<User | null>} - 사용자 정보 또는 null
 */
export async function getCachedUser(userId: number): Promise<User | null> {
  // 캐시에서 확인
  const cached = userProfileCache.get(userId);
  const now = Date.now();

  if (cached && now - cached.timestamp < CACHE_DURATION) {
    return cached.user;
  }

  // 캐시 미스 또는 만료된 경우 API 호출
  try {
    const response = await getUser(userId);
    if (response.ok) {
      // 캐시에 저장
      userProfileCache.set(userId, {
        user: response.item,
        timestamp: now,
      });
      return response.item;
    }
  } catch (error) {
    console.error("Failed to fetch user:", error);
  }

  return null;
}

/**
 * 여러 사용자 정보를 캐시 우선으로 가져옵니다
 * @param {number[]} userIds - 사용자 ID 배열
 * @returns {Promise<Map<number, User>>} - 사용자 ID를 키로 하는 Map
 */
/**
 * 내가 북마크한 게시글 목록을 가져옵니다.
 * @param {string} accessToken - 인증 토큰
 * @returns {Promise<ApiRes<BookmarkItem[]>>} - 북마크 목록 응답 객체
 */

/**
 * 내가 구매한 상품 목록을 가져옵니다.
 * @param {string} accessToken - 인증 토큰
 * @returns {Promise<ApiRes<OrderItem[]>>} - 구매 목록 응답 객체
 */
/**
 * 내가 판매한 게시물 목록을 가져옵니다.
 * @param {string} accessToken - 인증 토큰
 * @returns {Promise<ApiRes<PostItem[]>>} - 판매 게시물 목록 응답 객체
 */

/**
 * 내가 구매한 게시물 목록을 가져옵니다.
 * @param {string} accessToken - 인증 토큰
 * @returns {Promise<ApiRes<PostItem[]>>} - 구매 게시물 목록 응답 객체
 */
