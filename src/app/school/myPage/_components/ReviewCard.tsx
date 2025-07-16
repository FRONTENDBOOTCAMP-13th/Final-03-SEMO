/**
 * ReviewCard 컴포넌트
 *
 * 거래 후기를 작성하러 이동할 수 있는 카드 컴포넌트입니다.
 *
 * @example
 * const review = {
 *   id: 1,
 *   title: "제가 잠잘 때 사용하는 인형입니다",
 *   author: "박지수",
 *   image: <Image src="/some.jpg" alt="썸네일" fill />,
 * };
 *
 * <ReviewCard review={review} />
 *
 * @param review - 후기 정보를 담은 객체
 * @param review.id - 후기 대상 ID
 * @param review.title - 후기 대상 거래 제목
 * @param review.author - 판매자 이름
 * @param review.image - 썸네일 이미지 컴포넌트(JSX.Element)
 */

"use client";

import Link from "next/link";
import { Review } from "../data/reviewsData";

export default function ReviewCard({ review }: { review: Review }) {
  return (
    <div
      key={review.id}
      className="flex items-center justify-between p-4 bg-uni-white rounded-xl shadow-sm border border-uni-gray-100"
    >
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        {/* 왼쪽: 아바타 */}
        <div className="w-12 h-12 rounded-full bg-amber-200 flex-shrink-0 overflow-hidden">{review.image}</div>

        {/* 중앙: 텍스트 영역 */}
        <div className="flex-1 min-w-0">
          <div className="relative overflow-hidden">
            <h3 className="text-14 font-semibold text-uni-black font-pretendard whitespace-nowrap">{review.title}</h3>
            <div className="absolute top-0 right-0 w-8 h-full bg-gradient-to-l from-uni-white to-transparent pointer-events-none"></div>
          </div>
          <p className="text-14 text-uni-gray-400 font-pretendard mt-0.5">{review.author}</p>
        </div>
      </div>
      {/* 오른쪽: 버튼 */}
      <Link
        href={`/school/myPage/write-review/${review.id}`}
        className="px-4 py-2 text-14 bg-uni-blue-400 text-uni-white rounded-lg font-medium font-pretendard ml-4 hover:bg-uni-blue-500 transition-colors"
      >
        후기 작성
      </Link>
    </div>
  );
}
