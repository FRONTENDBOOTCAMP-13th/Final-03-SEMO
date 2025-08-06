"use client";

import { useState, useEffect } from "react";
import Pagination from "@/components/ui/Pagination";
import ReviewCard from "@/app/school/myPage/_components/ReviewCard";
import EmptyState from "@/components/common/EmptyState";
import { useResponsivePagination } from "@/lib/hooks/pagination/useResponsivePagination";
import { usePurchasedItems } from "@/lib/hooks/usePurchasedItems";
import { ordersToReviewItems, Review } from "@/lib/utils/postConverter";

export default function ReviewToWriteClient() {
  const { orders, isLoading, error, refetch } = usePurchasedItems();
  const [reviewsData, setReviewsData] = useState<Review[]>([]);
  const [isReviewsLoading, setIsReviewsLoading] = useState(true);
  const [pendingReviewedIds, setPendingReviewedIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    const storedIds = JSON.parse(localStorage.getItem("pendingReviewedIds") || "[]");
    setPendingReviewedIds(new Set(storedIds));

    const fetchReviews = async () => {
      if (orders.length > 0) {
        setIsReviewsLoading(true);
        try {
          const items = await ordersToReviewItems(orders);
          setReviewsData(items);
        } catch {
          setReviewsData([]);
        } finally {
          setIsReviewsLoading(false);
        }
      } else {
        setReviewsData([]);
        setIsReviewsLoading(false);
      }
    };

    fetchReviews();
  }, [orders]);

  useEffect(() => {
    if (reviewsData.length > 0) {
      const storedIds = JSON.parse(localStorage.getItem("pendingReviewedIds") || "[]");
      const actualPendingReviewIds = new Set(reviewsData.map((review) => review.id));
      const newStoredIds = storedIds.filter((id: number) => actualPendingReviewIds.has(id));
      if (newStoredIds.length !== storedIds.length) {
        localStorage.setItem("pendingReviewedIds", JSON.stringify(newStoredIds));
        setPendingReviewedIds(new Set(newStoredIds));
      }
    }
  }, [reviewsData]);

  const {
    currentPage,
    totalPages,
    paginatedData: visibleReviews,
    handlePageChange,
  } = useResponsivePagination({
    data: reviewsData,
    estimatedItemHeight: 88,
    minItemsPerPage: 3,
    maxItemsPerPage: 10,
    reservedHeight: 250,
  });

  if (isLoading || isReviewsLoading) {
    return (
      <div className="bg-uni-white min-h-screen p-4 space-y-6 pb-24">
        <h2 className="text-20 font-semibold mb-3 text-uni-black font-pretendard">미작성 후기</h2>
        <div className="flex items-center justify-center py-20">
          <div className="text-uni-gray-400 font-pretendard">구매 목록을 불러오는 중...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-uni-white min-h-screen p-4 space-y-6 pb-24">
        <h2 className="text-20 font-semibold mb-3 text-uni-black font-pretendard">미작성 후기</h2>
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="text-uni-gray-400 font-pretendard">{error}</div>
          <button onClick={refetch} className="px-4 py-2 bg-uni-blue text-white rounded-lg font-pretendard">
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-uni-white min-h-screen p-4 space-y-6 pb-24">
      <h2 className="text-20 font-semibold mb-3 text-uni-black font-pretendard">미작성 후기</h2>
      <div className="space-y-3">
        {reviewsData.length > 0 ? (
          <>
            {visibleReviews.map((review) => (
              <ReviewCard key={review.id} review={review} isReviewed={pendingReviewedIds.has(review.id)} />
            ))}
            <Pagination pageCount={totalPages} onPageChange={handlePageChange} forcePage={currentPage - 1} />
          </>
        ) : (
          <EmptyState message="아직 거래한게 없어요" />
        )}
      </div>
    </div>
  );
}
