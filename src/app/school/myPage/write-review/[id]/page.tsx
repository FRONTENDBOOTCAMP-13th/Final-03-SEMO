"use client";

import { useState } from "react";
import Image from "next/image";
import { Star } from "lucide-react";

export default function MyPageWriteReview() {
  const [rating, setRating] = useState(3);
  const [review, setReview] = useState("");

  const handleStarClick = (starIndex: number) => {
    setRating(starIndex + 1);
  };

  const handleSubmit = () => {
    console.log({ rating, review });
  };

  return (
    <div className="min-h-screen bg-white relative">
      <main className="p-4 space-y-6">
        {/* 거래 완료 섹션 */}
        <section className="bg-gray-50 rounded-lg p-4 shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-xs text-gray-500 mb-1">거래 완료</p>
              <h2 className="text-sm font-semibold text-gray-900 mb-1">제가 잠잘때 사용하는 인형입니다</h2>
              <p className="text-xs text-gray-500">2025년 07월 25일</p>
            </div>
            <div className="ml-4">
              <div className="w-30 h-20 bg-gray-100 rounded-lg overflow-hidden relative">
                <Image src="/api/placeholder/80/80" alt="상품 이미지" fill className="object-cover" />
              </div>
            </div>
          </div>
        </section>

        {/* 판매자/리뷰어 정보 섹션 */}
        <section className="flex items-center space-x-3 py-2">
          <div className="w-10 h-10 bg-gray-100 rounded-full overflow-hidden relative">
            <Image src="/api/placeholder/40/40" alt="프로필 이미지" fill className="object-cover" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">박지수</p>
            <p className="text-xs text-gray-500">행복 기숙사</p>
          </div>
        </section>

        {/* 별점 평가 섹션 */}
        <section className="py-3">
          <div className="flex space-x-1 justify-start">
            {[0, 1, 2, 3, 4].map((starIndex) => (
              <button key={starIndex} onClick={() => handleStarClick(starIndex)} className="p-0">
                <Star
                  className={`w-7 h-7 ${starIndex < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                />
              </button>
            ))}
          </div>
        </section>

        {/* 리뷰 작성 textarea */}
        <section className="mt-6">
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            className="w-full h-40 p-4 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-uni-blue-400 focus:border-transparent text-sm"
            rows={8}
            placeholder=""
          />
        </section>

        {/* 안내 문구 */}
        <section className="mt-4 mb-28">
          <p className="text-xs text-gray-400 leading-relaxed">
            다른 사용자에게 불쾌감을 줄 수 있는 리뷰는
            <br />
            법적조치를 받을 수 있습니다
          </p>
        </section>
      </main>

      {/* 등록 버튼 */}
      <button
        onClick={handleSubmit}
        className="fixed bottom-24 left-4 right-4 py-4 bg-uni-blue-400 text-white font-medium rounded-lg shadow-lg hover:bg-blue-600 transition-all duration-100 hover:shadow-xl active:scale-98"
      >
        등록하기
      </button>
    </div>
  );
}
