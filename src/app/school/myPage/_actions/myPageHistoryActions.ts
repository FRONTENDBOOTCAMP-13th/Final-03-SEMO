import { BookmarkResponse, BookmarkItem, OrderItem, PostItem } from "@/app/school/myPage/_types/apiResponse";
import apiClient from "@/lib/apiClient";
import { User } from "@/types/user";

/**
 * 내가 북마크한 게시글 목록을 가져옵니다.
 */
export async function getMyBookmarks(): Promise<BookmarkItem[]> {
  try {
    const jsonResponse: BookmarkResponse = await apiClient.get<BookmarkResponse>("/bookmarks/post");
    const bookmarkItems = Object.values(jsonResponse).filter(
      (item): item is BookmarkItem => typeof item === "object" && item !== null && "post" in item && "createdAt" in item
    );

    return bookmarkItems;
  } catch (error) {
    throw new Error(`북마크 목록을 불러올 수 없습니다: ${error instanceof Error ? error.message : "알 수 없는 오류"}`);
  }
}

/**
 * 내가 구매한 상품 목록을 가져옵니다.
 */
export async function getPurchasedItems(): Promise<OrderItem[]> {
  try {
    const response: OrderItem[] = await apiClient.get<OrderItem[]>("/orders");

    return response;
  } catch (error) {
    throw new Error(`구매 목록을 불러올 수 없습니다: ${error instanceof Error ? error.message : "알 수 없는 오류"}`);
  }
}

/**
 * 내가 판매한 게시물 목록을 가져옵니다. (type=sell)
 */
export async function getMySellPosts(): Promise<PostItem[]> {
  try {
    const response = await apiClient.get<PostItem[]>("/posts/users/?type=sell");
    return response || [];
  } catch (error) {
    throw new Error(`판매 게시물 목록을 불러올 수 없습니다.`);
  }
}

/**
 * 내가 구매한 게시물 목록을 가져옵니다. (type=buy)
 */
export async function getMyBuyPosts(): Promise<PostItem[]> {
  try {
    const response = await apiClient.get<PostItem[]>("/posts/users/?type=buy");
    return response || [];
  } catch (error) {
    throw new Error(`구매 게시물 목록을 불러올 수 없습니다.`);
  }
}

/**
 * 로그인한 사용자 정보를 가져옵니다.
 */
export async function getMyUserInfo(userId: number): Promise<User> {
  try {
    const response = await apiClient.get<{ item: User }>(`/users/${userId}`);
    return response.item;
  } catch (error) {
    throw new Error(`사용자 정보를 불러올 수 없습니다: ${error instanceof Error ? error.message : "알 수 없는 오류"}`);
  }
}
