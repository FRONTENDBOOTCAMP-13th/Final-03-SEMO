"use client";

import ReviewCard from "../_components/ReviewCard";
import EmptyState from "../_components/EmptyState";
import { getAllReviews } from "../data/reviewsData";

export default function MyPageReviewsToWrite() {
  // 공통 데이터에서 리뷰 목록 가져오기
  const reviewsData = getAllReviews();

  return (
    <div className="bg-white min-h-screen p-4 space-y-6">
      {/* 소제목 */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-black">미작성 후기</h2>
        {/* 후기 아이템 목록 */}
        <div className="space-y-3 ">
          {reviewsData.length > 0 ? (
            reviewsData.map((review) => <ReviewCard key={review.id} review={review} />)
          ) : (
            <EmptyState message="아직 거래한게 없어요" />
          )}
        </div>
      </section>
    </div>
  );
}
