import { BookmarkResponse, BookmarkItem, OrderItem, ProductItem } from "@/app/school/myPage/_types/apiResponse";
import apiClient from "@/lib/apiClient";

/**
 * 내가 북마크한 게시글 목록을 가져옵니다.
 */
export async function getMyBookmarks(): Promise<BookmarkItem[]> {
  try {
    const jsonResponse: BookmarkResponse = await apiClient.get<BookmarkResponse>("/bookmarks/post");

    const bookmarkItems: BookmarkItem[] = [];

    for (const key in jsonResponse) {
      if (key !== "ok" && jsonResponse[key] && typeof jsonResponse[key] === "object") {
        bookmarkItems.push(jsonResponse[key] as BookmarkItem);
      }
    }

    if (bookmarkItems.length > 0) {
      return bookmarkItems;
    }

    return [];
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
 * 내가 판매한 상품 목록을 가져옵니다.
 */
export async function getMyProducts(): Promise<ProductItem[]> {
  try {
    const products: ProductItem[] = await apiClient.get<ProductItem[]>("/seller/products");
    return products;
  } catch (error) {
    throw new Error(
      `판매 상품 목록을 불러올 수 없습니다: ${error instanceof Error ? error.message : "알 수 없는 오류"}`
    );
  }
}
