"use client";

import { useState, use, useEffect } from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import SaveFloatingButton from "../../_components/SaveFloatingButton";
import { usePurchasedItems } from "../../_hooks/useHistoryApi";
import { orderToReviewItems } from "../../_utils/postConverter";
import { Review } from "../../_utils/postConverter";

interface MyPageWriteReviewProps {
  params: Promise<{
    id: string;
  }>;
}

export default function MyPageWriteReview({ params }: MyPageWriteReviewProps) {
  const [rating, setRating] = useState(3);
  const [review, setReview] = useState("");
  const [reviewData, setReviewData] = useState<Review | null>(null);
  const [isReviewDataLoading, setIsReviewDataLoading] = useState(true);

  const { id } = use(params);
  const { orders, isLoading, error } = usePurchasedItems();

  useEffect(() => {
    const fetchReviewData = async () => {
      if (orders.length > 0) {
        setIsReviewDataLoading(true);
        try {
          // 모든 주문을 리뷰 아이템으로 변환합니다.
          const allReviews = await Promise.all(orders.map((order) => orderToReviewItems(order)));
          const flatReviews = allReviews.flat();

          // URL의 id와 일치하는 리뷰 아이템을 찾습니다.
          const foundReview = flatReviews.find((item) => item.id === parseInt(id));

          if (foundReview) {
            setReviewData(foundReview);
          } else {
            setReviewData(null);
          }
        } catch (err) {
          console.error("리뷰 데이터 로딩 실패:", err);
          setReviewData(null);
        } finally {
          setIsReviewDataLoading(false);
        }
      } else {
        setReviewData(null);
        setIsReviewDataLoading(false);
      }
    };

    fetchReviewData();
  }, [orders, id]);

  // 로딩 상태
  if (isLoading || isReviewDataLoading) {
    return (
      <div className="min-h-screen bg-uni-white flex items-center justify-center">
        <div className="text-uni-gray-400 font-pretendard">상품 정보를 불러오는 중...</div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="min-h-screen bg-uni-white flex items-center justify-center">
        <div className="text-uni-gray-400 font-pretendard">상품 정보를 불러올 수 없습니다.</div>
      </div>
    );
  }

  // 리뷰 데이터가 없는 경우 기본값
  const defaultReviewData: Review = {
    id: parseInt(id),
    title: "상품 정보",
    author: "판매자",
    image: "/assets/defaultimg.png",
    location: "기숙사",
    date: "2025년 07월 15일",
  };

  const currentReviewData = reviewData || defaultReviewData;

  const handleStarClick = (starIndex: number) => {
    setRating(starIndex + 1);
  };

  const handleSubmit = () => {
    console.log({
      reviewId: id,
      productTitle: currentReviewData.title,
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
              <h2 className="text-14 font-semibold text-uni-black mb-1 font-pretendard">{currentReviewData.title}</h2>
              <p className="text-10 text-uni-gray-400 font-pretendard">{currentReviewData.date}</p>
            </div>
            <div className="ml-4">
              <div className="w-30 h-20 bg-uni-gray-100 rounded-lg overflow-hidden relative">
                <Image
                  src={currentReviewData.image.startsWith("http") ? currentReviewData.image : "/api/placeholder/80/80"}
                  alt="상품 이미지"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 판매자/리뷰어 정보 섹션 */}
        <section className="flex items-center space-x-3 py-2">
          <div className="w-10 h-10 bg-uni-gray-100 rounded-full overflow-hidden relative">
            {currentReviewData.image.startsWith("http") ? (
              <Image src={currentReviewData.image} alt="프로필" fill className="object-cover" />
            ) : (
              currentReviewData.image
            )}
          </div>
          <div>
            <p className="text-14 font-semibold text-uni-black font-pretendard">{currentReviewData.author}</p>
            <p className="text-10 text-uni-gray-400 font-pretendard">
              {currentReviewData.location || "위치 정보 없음"}
            </p>
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
