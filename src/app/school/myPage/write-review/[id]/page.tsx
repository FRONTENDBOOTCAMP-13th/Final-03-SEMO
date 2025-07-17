"use client";

import { useState, use } from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import SaveFloatingButton from "../../_components/SaveFloatingButton";
import { getReviewById } from "../../data/reviewsData";

interface MyPageWriteReviewProps {
  params: Promise<{
    id: string;
  }>;
}

export default function MyPageWriteReview({ params }: MyPageWriteReviewProps) {
  const [rating, setRating] = useState(3);
  const [review, setReview] = useState("");

  const { id } = use(params);

  // URL에서 받은 id로 해당하는 리뷰 데이터 찾기
  const currentReview = getReviewById(parseInt(id));

  // 해당 id의 데이터가 없는 경우 기본값 사용
  const reviewData = currentReview || {
    id: parseInt(id),
    title: "상품 정보",
    author: "판매자",
    image: "👤",
    location: "기숙사",
    date: "2025년 07월 15일",
  };

  const handleStarClick = (starIndex: number) => {
    setRating(starIndex + 1);
  };

  const handleSubmit = () => {
    console.log({
      reviewId: id,
      productTitle: reviewData.title,
      rating,
      review,
    });
  };

  return (
    <div className="min-h-screen bg-uni-white relative">
      <main className="p-4 space-y-6">
        {/* 거래 완료 섹션 */}
        <section className="bg-uni-gray-100 rounded-lg p-4 shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-10 text-uni-gray-400 mb-1 font-pretendard">거래 완료</p>
              <h2 className="text-14 font-semibold text-uni-black mb-1 font-pretendard">{reviewData.title}</h2>
              <p className="text-10 text-uni-gray-400 font-pretendard">{reviewData.date}</p>
            </div>
            <div className="ml-4">
              <div className="w-30 h-20 bg-uni-gray-100 rounded-lg overflow-hidden relative">
                <Image src="/api/placeholder/80/80" alt="상품 이미지" fill className="object-cover" />
              </div>
            </div>
          </div>
        </section>

        {/* 판매자/리뷰어 정보 섹션 */}
        <section className="flex items-center space-x-3 py-2">
          <div className="w-10 h-10 bg-uni-gray-100 rounded-full overflow-hidden relative">{reviewData.image} </div>
          <div>
            <p className="text-14 font-semibold text-uni-black font-pretendard">{reviewData.author}</p>
            <p className="text-10 text-uni-gray-400 font-pretendard">{reviewData.location}</p>
          </div>
        </section>

        {/* 별점 평가 섹션 */}
        <section className="py-3">
          <div className="flex space-x-1 justify-start">
            {[0, 1, 2, 3, 4].map((starIndex) => (
              <button key={starIndex} onClick={() => handleStarClick(starIndex)} className="p-0">
                <Star
                  className={`w-7 h-7 ${starIndex < rating ? "text-yellow-400 fill-yellow-400" : "text-uni-gray-300"}`}
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
            className="w-full h-40 p-4 border border-uni-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-uni-blue-400 focus:border-transparent text-14 font-pretendard"
            rows={8}
            placeholder=""
          />
        </section>

        {/* 안내 문구 */}
        <section className="mt-4 mb-28">
          <p className="text-10 text-uni-gray-300 leading-relaxed font-pretendard">
            다른 사용자에게 불쾌감을 줄 수 있는 리뷰는 법적조치를 받을 수 있습니다
          </p>
        </section>
      </main>

      {/* 등록 버튼 */}
      <SaveFloatingButton onClick={handleSubmit}>등록하기</SaveFloatingButton>
    </div>
  );
}
