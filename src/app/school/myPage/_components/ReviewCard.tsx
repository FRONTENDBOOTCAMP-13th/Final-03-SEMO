"use client";
import Link from "next/link";
// 리뷰 공통 타입
export interface Review {
  id: number;
  title: string;
  author: string;
  image: string;
}

export default function ReviewCard({ review }: { review: Review }) {
  return (
    <div
      key={review.id}
      className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100"
    >
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        {/* 왼쪽: 아바타 */}
        <div className="w-12 h-12 rounded-full bg-amber-200 flex-shrink-0 overflow-hidden">{review.image}</div>

        {/* 중앙: 텍스트 영역 */}
        <div className="flex-1 min-w-0">
          <div className="relative overflow-hidden">
            <h3 className="font-semibold text-gray-900 text-sm whitespace-nowrap">{review.title}</h3>
            <div className="absolute top-0 right-0 w-8 h-full bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
          </div>
          <p className="text-sm text-gray-600 mt-0.5">{review.author}</p>
        </div>
      </div>
      {/* 오른쪽: 버튼 */}
      <Link
        href={`/school/myPage/write-review/${review.id}`}
        className="px-4 py-2 bg-blue-400 text-white text-sm rounded-lg font-medium ml-4 hover:bg-blue-600 transition-colors"
      >
        후기 작성
      </Link>{" "}
    </div>
  );
}
