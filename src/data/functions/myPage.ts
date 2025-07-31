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

/**
 * 여러 사용자 정보를 한번에 가져옵니다 (캐시 최적화)
 * @param {number[]} userIds - 사용자 ID 배열
 * @returns {Promise<ApiRes<User[]>>} - 사용자 목록 응답 객체
 */

/**
 * 사용자 프로필 캐시 Map (클라이언트 사이드 캐시)
 */

/**
 * 캐시된 사용자 정보를 가져옵니다 (클라이언트 사이드 최적화)
 * @param {number} userId - 사용자 ID
 * @returns {Promise<User | null>} - 사용자 정보 또는 null
 */

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
