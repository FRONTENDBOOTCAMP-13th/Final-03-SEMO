import { useState, useEffect, useCallback } from "react";
import {
  getMyBookmarks,
  getPurchasedItems,
  getMySellPosts,
  getMyBuyPosts,
} from "@/app/school/myPage/_actions/myPageHistoryActions";
import { BookmarkItem, OrderItem, PostItem } from "@/app/school/myPage/_types/apiResponse";

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

/**
 * 내가 판매하는 게시물 목록을 가져오는 훅
 */
export function useMyPosts() {
  const [sellPosts, setSellPosts] = useState<PostItem[]>([]);
  const [buyPosts, setBuyPosts] = useState<PostItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMyPosts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [sellResponse, buyResponse] = await Promise.all([
        getMySellPosts(), // type=sell
        getMyBuyPosts(), // type=buy
      ]);

      setSellPosts(sellResponse);
      setBuyPosts(buyResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : "게시물 목록을 불러올 수 없습니다.");
      setSellPosts([]);
      setBuyPosts([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyPosts();
  }, [fetchMyPosts]);

  return {
    sellPosts,
    buyPosts,
    isLoading,
    error,
    refetch: fetchMyPosts,
  };
}
