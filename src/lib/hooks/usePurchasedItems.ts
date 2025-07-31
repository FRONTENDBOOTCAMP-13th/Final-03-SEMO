"use client";

import { useState, useEffect, useCallback } from "react";
import { getPurchasedItems } from "@/data/functions/myPage";
import { useUserStore } from "@/store/userStore";
import { OrderItem } from "@/types/myPageApi";

interface UsePurchasedItemsReturn {
  orders: OrderItem[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * 내가 구매한 상품 목록을 가져오는 훅
 */
export function usePurchasedItems(): UsePurchasedItemsReturn {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = useUserStore((state) => state.user);

  const fetchPurchasedItems = useCallback(async () => {
    if (!user?.token?.accessToken) {
      setError("로그인이 필요합니다.");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await getPurchasedItems(user.token.accessToken);
      if (response.ok) {
        setOrders(response.item);
      } else {
        setError("구매 목록을 불러올 수 없습니다.");
        setOrders([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "구매 목록을 불러올 수 없습니다.");
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  }, [user?.token?.accessToken]);

  useEffect(() => {
    fetchPurchasedItems();
  }, [fetchPurchasedItems]);

  return {
    orders,
    isLoading,
    error,
    refetch: fetchPurchasedItems,
  };
}
