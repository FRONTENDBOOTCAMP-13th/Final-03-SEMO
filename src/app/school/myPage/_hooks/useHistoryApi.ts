import { useState, useEffect, useCallback } from "react";
import { getMyBookmarks } from "../_services/historyService";
import { BookmarkItem } from "../_types/apiResponse";

/**
 * 북마크 목록을 가져오는 훅
 */
export function useMyBookmarks() {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookmarks = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await getMyBookmarks();
      console.log("🔍 [useMyBookmarks] getMyBookmarks 응답:", response);
      setBookmarks(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "북마크를 불러올 수 없습니다.");
      setBookmarks([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  return {
    bookmarks,
    isLoading,
    error,
    refetch: fetchBookmarks,
  };
}

/**
 * 구매한 상품 목록을 가져오는 훅
 */
export function usePurchasedItems() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await getPurchasedItems();
      console.log("🔍 [usePurchasedItems] getPurchasedItems 응답:", response); // 임시 로그
      setOrders(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "구매 목록을 불러올 수 없습니다.");
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    orders,
    isLoading,
    error,
    refetch: fetchOrders,
  };
}
