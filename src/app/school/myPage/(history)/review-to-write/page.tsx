"use client";

import { useState, useEffect } from "react";
import Pagination from "@/components/ui/Pagination";
import ReviewCard from "@/app/school/myPage/_components/ReviewCard";
import EmptyState from "@/components/common/EmptyState";
import { useResponsivePagination } from "@/lib/hooks/pagination/useResponsivePagination";
import { usePurchasedItems } from "@/lib/hooks/usePurchasedItems";
import { ordersToReviewItems, Review } from "@/lib/utils/postConverter";

export default function MyPageReviewsToWrite() {
  // API로부터 구매한 상품 목록 가져오기 (리뷰 작성 대상)
  const { orders, isLoading, error, refetch } = usePurchasedItems();
  const [reviewsData, setReviewsData] = useState<Review[]>([]);
  const [isReviewsLoading, setIsReviewsLoading] = useState(true);
  const [pendingReviewedIds, setPendingReviewedIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    const storedIds = JSON.parse(localStorage.getItem("pendingReviewedIds") || "[]");
    console.log("초기 로드: localStorage에서 읽은 pendingReviewedIds:", storedIds);
    setPendingReviewedIds(new Set(storedIds));

    const fetchReviews = async () => {
      if (orders.length > 0) {
        setIsReviewsLoading(true);
        try {
          const items = await ordersToReviewItems(orders);
          setReviewsData(items);
          console.log("리뷰 데이터 변환 완료:", items);
        } catch (err) {
          console.error("리뷰 데이터 변환 중 오류 발생:", err);
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
    // reviewsData가 업데이트될 때 localStorage 정리
    if (reviewsData.length > 0) {
      const storedIds = JSON.parse(localStorage.getItem("pendingReviewedIds") || "[]");
      const actualPendingReviewIds = new Set(reviewsData.map((review) => review.id));
      console.log("localStorage 정리: 현재 localStorage의 pendingReviewedIds:", storedIds);
      console.log("localStorage 정리: 실제 리뷰 작성 대상 product IDs:", Array.from(actualPendingReviewIds));
      const newStoredIds = storedIds.filter((id: number) => actualPendingReviewIds.has(id)); // reviewsData에 있는 ID만 남김
      if (newStoredIds.length !== storedIds.length) {
        localStorage.setItem("pendingReviewedIds", JSON.stringify(newStoredIds));
        setPendingReviewedIds(new Set(newStoredIds));
        console.log("localStorage 정리: 업데이트된 pendingReviewedIds:", newStoredIds);
      }
    }
  }, [reviewsData]);

  // 반응형 페이지네이션 로직을 hook으로 분리
  const {
    currentPage,
    totalPages,
    itemsPerPage,
    paginatedData: visibleReviews,
    handlePageChange,
    viewportHeight,
    isClient,
  } = useResponsivePagination({
    data: reviewsData,
    estimatedItemHeight: 88, // ReviewCard의 예상 높이
    minItemsPerPage: 3,
    maxItemsPerPage: 10,
    reservedHeight: 250, //실제 컨텐츠 높이 = 전체 화면 높이 - reservedHeight
    // 헤더, 페이지네이션, 네비게이션을 위한 충분한 공간
  });

  // 로딩 상태 처리
  if (isLoading || isReviewsLoading) {
    return (
      <div className="bg-uni-white min-h-screen p-4 space-y-6 pb-24">
        <section>
          <h2 className="text-20 font-semibold mb-3 text-uni-black font-pretendard">미작성 후기</h2>
          <div className="flex items-center justify-center py-20">
            <div className="text-uni-gray-400 font-pretendard">구매 목록을 불러오는 중...</div>
          </div>
        </section>
      </div>
    );
  }

  // 에러 상태 처리
  if (error) {
    return (
      <div className="bg-uni-white min-h-screen p-4 space-y-6 pb-24">
        <section>
          <h2 className="text-20 font-semibold mb-3 text-uni-black font-pretendard">미작성 후기</h2>
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="text-uni-gray-400 font-pretendard">{error}</div>
            <button onClick={refetch} className="px-4 py-2 bg-uni-blue text-white rounded-lg font-pretendard">
              다시 시도
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="bg-uni-white min-h-screen p-4 space-y-6 pb-24">
      {/* 소제목 */}
      <section>
        <h2 className="text-20 font-semibold mb-3 text-uni-black font-pretendard">미작성 후기</h2>
        {/* 후기 아이템 목록 */}
        <div className="space-y-3">
          {reviewsData.length > 0 ? (
            <>
              {visibleReviews.map((review) => (
                <ReviewCard key={review.id} review={review} isReviewed={pendingReviewedIds.has(review.id)} />
              ))}

              {/* 페이지네이션 컴포넌트  */}

              <Pagination pageCount={totalPages} onPageChange={handlePageChange} forcePage={currentPage - 1} />
            </>
          ) : (
            <EmptyState message="아직 거래한게 없어요" />
          )}
        </div>
      </section>
      {/* 개발 환경에서만 보이는 디버그 정보 */}
      {process.env.NODE_ENV === "development" && isClient && (
        <div className="text-10 text-uni-gray-400 bg-uni-gray-100 p-2 rounded font-pretendard">
          화면 높이: {viewportHeight}px | 페이지당 아이템: {itemsPerPage}개 | 총 페이지: {totalPages}
        </div>
      )}
    </div>
  );
}
