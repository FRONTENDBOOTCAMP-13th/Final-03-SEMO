"use client";

import React, { useState, use, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Star } from "lucide-react";
import SaveFloatingButton from "@/components/ui/SaveFloatingButton";
import { usePurchasedItems } from "@/lib/hooks/usePurchasedItems";
import { orderToReviewItems, Review } from "@/lib/utils/postConverter";
import { submitReview } from "@/data/actions/myPage";
import { useUserStore } from "@/store/userStore";

interface MyPageWriteReviewProps {
  params: Promise<{
    id: string;
  }>;
}

export default function MyPageWriteReview({ params }: MyPageWriteReviewProps) {
  const [rating, setRating] = useState(3);
  const [reviewData, setReviewData] = useState<Review | null>(null);
  const [isReviewDataLoading, setIsReviewDataLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const reviewTextareaRef = useRef<HTMLTextAreaElement>(null);

  const { id } = use(params);
  const router = useRouter();
  const { orders, isLoading, error: purchasedItemsError } = usePurchasedItems();
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    const fetchReviewData = async () => {
      if (orders.length > 0) {
        setIsReviewDataLoading(true);
        try {
          const allReviews = await Promise.all(orders.map((order) => orderToReviewItems(order)));
          const flatReviews = allReviews.flat();

          const foundReview = flatReviews.find((item: Review) => item.id === parseInt(id));

          if (foundReview) {
            setReviewData(foundReview);
          } else {
            setReviewData(null);
          }
          // } catch (err) {
        } catch {
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

  if (isLoading || isReviewDataLoading) {
    return (
      <div className="min-h-screen bg-uni-white flex items-center justify-center">
        <div className="text-uni-gray-400 font-pretendard">상품 정보를 불러오는 중...</div>
      </div>
    );
  }

  if (purchasedItemsError) {
    return (
      <div className="min-h-screen bg-uni-white flex items-center justify-center">
        <div className="text-uni-gray-400 font-pretendard">상품 정보를 불러올 수 없습니다.</div>
      </div>
    );
  }

  const defaultReviewData: Review = {
    id: parseInt(id),
    orderId: 0,
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

  const handleSubmit = async () => {
    if (!reviewData || isSubmitting || !user?.token?.accessToken) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("accessToken", user.token.accessToken);
      formData.append("order_id", reviewData.orderId.toString());
      formData.append("product_id", reviewData.id.toString());
      formData.append("rating", rating.toString());
      formData.append("content", reviewTextareaRef.current?.value || "");

      const result = await submitReview(null, formData);

      if (result.ok) {
        alert("리뷰가 성공적으로 등록되었습니다!");
        updateReviewedProductIdsInLocalStorage(reviewData.id);
        router.back();
      } else {
        alert(`리뷰 등록에 실패했습니다: ${result.message}`);
      }
    } catch (error) {
      console.error("리뷰 등록 오류:", error);
      alert("리뷰 등록에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 사용자가 리뷰를 성공적으로 제출했을 때, 해당 상품의 product_id를 localStorage에 추가합니다
  const updateReviewedProductIdsInLocalStorage = (productId: number) => {
    const reviewedProductIds = JSON.parse(localStorage.getItem("pendingReviewedIds") || "[]");
    if (!reviewedProductIds.includes(productId)) {
      reviewedProductIds.push(productId);
      localStorage.setItem("pendingReviewedIds", JSON.stringify(reviewedProductIds));
    }
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
                <Image src={currentReviewData.image} alt="상품 이미지" fill className="object-cover" />
              </div>
            </div>
          </div>
        </section>

        {/* 판매자/리뷰어 정보 섹션 */}
        <section className="flex items-center space-x-3 py-2">
          <div className="w-10 h-10 bg-uni-gray-100 rounded-full overflow-hidden relative">
            {currentReviewData.sellerProfileImage ? (
              <Image src={currentReviewData.sellerProfileImage} alt="프로필" fill className="object-cover" />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-uni-gray-400">
                {currentReviewData.author.charAt(0)}
              </div>
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
            ref={reviewTextareaRef}
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
