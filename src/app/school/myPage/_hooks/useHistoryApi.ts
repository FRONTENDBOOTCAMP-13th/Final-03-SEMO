"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getMyBookmarks,
  getPurchasedItems,
  getMySellPosts,
  getMyBuyPosts,
  getMyUserInfo,
} from "@/app/school/myPage/_actions/myPageHistoryActions";
import { BookmarkItem, OrderItem, PostItem } from "@/app/school/myPage/_types/apiResponse";
import { useUserStore } from "@/store/userStore";
import { User } from "@/types/user";

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

/**
 * 마이페이지에 필요한 모든 데이터를 가져오는 훅
 */
export function useMyPageData() {
  const [userData, setUserData] = useState<User | null>(null);
  const [counts, setCounts] = useState({ posts: 0, reviews: 0, bookmarks: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userId = useUserStore((state) => state.user._id);

  const fetchMyPageData = useCallback(async () => {
    if (!userId) {
      setError("사용자 ID를 찾을 수 없습니다.");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const [userInfo, purchasedItems, mySellPosts, myBookmarks] = await Promise.all([
        getMyUserInfo(userId), // 사용자 정보
        getPurchasedItems(), // 구매 목록 (후기 수 계산용)
        getMySellPosts(), // 판매 게시물 (게시글 수 계산용)
        getMyBookmarks(), // 북마크 목록 (찜한 목록 수 계산용)
      ]);

      setUserData(userInfo);
      setCounts({
        posts: userInfo.posts || 0, // 응답2.json에 posts 필드 있음
        reviews: purchasedItems.length, // 구매 목록 수 (후기 수로 간주)
        bookmarks: userInfo.bookmark?.posts || 0, // 응답2.json에 bookmark.posts 필드 있음
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "마이페이지 데이터를 불러올 수 없습니다.");
      setUserData(null);
      setCounts({ posts: 0, reviews: 0, bookmarks: 0 });
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchMyPageData();
  }, [fetchMyPageData]);

  return {
    userData,
    postsCount: counts.posts,
    reviewsCount: counts.reviews,
    bookmarksCount: counts.bookmarks,
    isLoading,
    error,
    refetch: fetchMyPageData,
  };
}
