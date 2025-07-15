"use client";

import Link from "next/link";
import Image from "next/image";

// 데이터 타입 정의
interface ReviewItem {
  id: number;
  title: string;
  author: string;
  imageUrl: string;
}

// 예시 데이터
const reviewsData: ReviewItem[] = [
  { id: 1, title: "인간관계론 2학년 교양", author: "김지원", imageUrl: "/images/avatar1.png" },
  { id: 2, title: "컵라면 20개", author: "박서준", imageUrl: "/images/avatar2.png" },
  { id: 3, title: "닭가슴살 샐러드", author: "이지아", imageUrl: "/images/avatar3.png" },
];

export default function MyPageReviewsToWrite() {
  return (
    <div className="bg-white min-h-screen py-4 px-6">
      {/* 소제목 */}
      <h2 className="text-xl font-bold text-gray-900 mb-6">미작성 후기 3건</h2>

      {/* 후기 아이템 목록 */}
      <div className="space-y-4">
        {reviewsData.map((review) => (
          <div
            key={review.id}
            className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100"
          >
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              {/* 왼쪽: 아바타 */}
              <div className="w-12 h-12 rounded-full bg-amber-200 flex-shrink-0 overflow-hidden">
                <Image
                  src={review.imageUrl}
                  alt={`${review.author} 프로필`}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // 이미지 로드 실패 시 기본 배경색 유지
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>

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
              className="px-4 py-2 bg-blue-400 text-white text-sm rounded-full font-medium ml-4 hover:bg-blue-600 transition-colors"
            >
              후기 작성
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
