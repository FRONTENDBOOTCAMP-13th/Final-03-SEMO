"use client";

import { useState, useEffect } from "react";
import { getCachedUser, getMyBookmarks, getPurchasedItems, getMySellPosts, getMyBuyPosts } from "@/data/functions/myPage";
import { useUserStore } from "@/store/userStore";
import { User } from "@/types/user";

interface UseMyPageDataReturn {
  userData: User | null;
  postsCount: number;
  reviewsCount: number;
  bookmarksCount: number;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * 마이페이지 메인 데이터를 가져오는 훅
 * 사용자 정보와 각종 카운트 정보를 제공합니다.
 */
export function useMyPageData(): UseMyPageDataReturn {
  const [userData, setUserData] = useState<User | null>(null);
  const [postsCount, setPostsCount] = useState(0);
  const [reviewsCount, setReviewsCount] = useState(0);
  const [bookmarksCount, setBookmarksCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = useUserStore((state) => state.user);

  const fetchMyPageData = async () => {
    if (!user?.token?.accessToken || !user._id) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // 사용자 정보 가져오기
      const userInfo = await getCachedUser(user._id, true); // forceRefresh: true 추가
      setUserData(userInfo);

      // 각종 카운트 정보 가져오기
      const [bookmarksRes, purchasedRes, sellPostsRes, buyPostsRes] = await Promise.all([
        getMyBookmarks(user.token.accessToken),
        getPurchasedItems(user.token.accessToken),
        getMySellPosts(user.token.accessToken),
        getMyBuyPosts(user.token.accessToken),
      ]);

      setBookmarksCount(bookmarksRes.ok ? bookmarksRes.item.length : 0);
      setReviewsCount(purchasedRes.ok ? purchasedRes.item.length : 0);
      setPostsCount(
        (sellPostsRes.ok ? sellPostsRes.item.length : 0) + 
        (buyPostsRes.ok ? buyPostsRes.item.length : 0)
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "데이터를 불러올 수 없습니다.";
      setError(errorMessage);
      console.error("마이페이지 데이터 로드 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyPageData();
  }, [user?.token?.accessToken, user?._id]);

  return {
    userData,
    postsCount,
    reviewsCount,
    bookmarksCount,
    isLoading,
    error,
    refetch: fetchMyPageData,
  };
}
