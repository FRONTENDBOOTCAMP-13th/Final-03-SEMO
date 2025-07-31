"use client";

import { useState, useEffect, useCallback } from "react";
import { getMyBookmarks } from "@/data/functions/myPage";
import { useUserStore } from "@/store/userStore";
import { BookmarkItem } from "@/types/myPageApi";

interface UseMyBookmarksReturn {
  bookmarks: BookmarkItem[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * 내 북마크 목록을 가져오는 훅
 */
export function useMyBookmarks(): UseMyBookmarksReturn {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = useUserStore((state) => state.user);

  const fetchBookmarks = useCallback(async () => {
    if (!user?.token?.accessToken) {
      setError("로그인이 필요합니다.");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await getMyBookmarks(user.token.accessToken);
      if (response.ok) {
        setBookmarks(response.item);
      } else {
        setError("북마크를 불러올 수 없습니다.");
        setBookmarks([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "북마크를 불러올 수 없습니다.");
      setBookmarks([]);
    } finally {
      setIsLoading(false);
    }
  }, [user?.token?.accessToken]);

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
