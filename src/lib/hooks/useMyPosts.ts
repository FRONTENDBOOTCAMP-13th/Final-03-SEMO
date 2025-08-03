"use client";

import { useState, useEffect, useCallback } from "react";
import { getMySellPosts, getMyBuyPosts, getMyGroupPurchasePosts } from "@/data/functions/myPage";
import { useUserStore } from "@/store/userStore";
import { PostItem } from "@/types/myPageApi";

interface UseMyPostsReturn {
  sellPosts: PostItem[];
  buyPosts: PostItem[];
  groupPurchasePosts: PostItem[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * 내가 작성한 게시물 목록을 가져오는 훅 (판매글 + 구매글)
 */
export function useMyPosts(): UseMyPostsReturn {
  const [sellPosts, setSellPosts] = useState<PostItem[]>([]);
  const [buyPosts, setBuyPosts] = useState<PostItem[]>([]);
  const [groupPurchasePosts, setGroupPurchasePosts] = useState<PostItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = useUserStore((state) => state.user);

  const fetchMyPosts = useCallback(async () => {
    if (!user?.token?.accessToken) {
      setError("로그인이 필요합니다.");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const [sellResponse, buyResponse, groupPurchaseResponse] = await Promise.all([
        getMySellPosts(user.token.accessToken),
        getMyBuyPosts(user.token.accessToken),
        getMyGroupPurchasePosts(user.token.accessToken)
      ]);

      if (sellResponse.ok && buyResponse.ok && groupPurchaseResponse.ok) {
        setSellPosts(sellResponse.item);
        setBuyPosts(buyResponse.item);
        setGroupPurchasePosts(groupPurchaseResponse.item);
      } else {
        setError("게시물을 불러올 수 없습니다.");
        setSellPosts([]);
        setBuyPosts([]);
        setGroupPurchasePosts([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "게시물을 불러올 수 없습니다.");
      setSellPosts([]);
      setBuyPosts([]);
      setGroupPurchasePosts([]);
    } finally {
      setIsLoading(false);
    }
  }, [user?.token?.accessToken]);

  useEffect(() => {
    fetchMyPosts();
  }, [fetchMyPosts]);

  return {
    sellPosts,
    buyPosts,
    groupPurchasePosts,
    isLoading,
    error,
    refetch: fetchMyPosts,
  };
}
