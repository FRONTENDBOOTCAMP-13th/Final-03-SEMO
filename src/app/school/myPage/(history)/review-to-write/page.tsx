"use client";

import Pagination from "../../_components/Pagination";
import ReviewCard from "../../_components/ReviewCard";
import EmptyState from "../../_components/EmptyState";
import { getAllReviews } from "../../data/reviewsData";
import { useResponsivePagination } from "../../_hooks/pagination/useResponsivePagination";

export default function MyPageReviewsToWrite() {
  // 공통 데이터에서 리뷰 목록 가져오기
  const reviewsData = getAllReviews();

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
                <ReviewCard key={review.id} review={review} />
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
