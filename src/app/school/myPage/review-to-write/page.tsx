"use client";

import ReviewCard, { Review } from "../_components/ReviewCard";
import EmptyState from "../_components/EmptyState";

// 예시 데이터
const reviewsData: Review[] = [
  { id: 1, title: "인간관계론 2학년 교양", author: "김지원", image: "🧔" },
  { id: 2, title: "컵라면 20개", author: "박서준", image: "👨‍👩‍👧‍👦" },
  { id: 3, title: "닭가슴살 샐러드", author: "이지아", image: "👩‍👧‍👦" },
];

export default function MyPageReviewsToWrite() {
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
