"use client";

import React, { useState, use, useEffect, useRef, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Star } from "lucide-react";
import { usePurchasedItems } from "@/lib/hooks/usePurchasedItems";
import { orderToReviewItems, Review } from "@/lib/utils/postConverter";
import { submitReview } from "@/data/actions/myPage";
import { useUserStore } from "@/store/userStore";

// 동적 import로 성능 최적화
const SaveFloatingButton = dynamic(() => import("@/components/ui/SaveFloatingButton"), {
  loading: () => <div className="fixed left-4 right-4 bottom-24 bg-gray-300 animate-pulse py-3 rounded-lg"></div>,
});

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
  const user = useUserStore((state) => state.user);

  // Hook 호출 최적화 - 조건부 실행 제거
  const { orders, isLoading, error: purchasedItemsError } = usePurchasedItems();

  // 데이터 처리 최적화 - 판매자 정보 포함
  const currentReviewData = useMemo(() => {
    if (!orders.length) return null;

    // 모든 주문에서 해당 상품 찾기
    for (const order of orders) {
      const product = order.products.find((p) => p._id === parseInt(id));
      if (product) {
        return {
          id: product._id,
          orderId: order._id,
          title: product.name,
          author: "판매자", // 기본값, orderToReviewItems에서 업데이트
          image: product.image?.path || "/assets/defaultimg.png",
          sellerProfileImage: "/assets/defaultimg.png", // 기본값, orderToReviewItems에서 업데이트
          location: "위치 정보 로딩 중...", // 판매자 정보에서 address를 가져올 예정
          date: new Date(order.createdAt)
            .toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })
            .replace(/\. /g, "년 ")
            .replace(/\.$/, "일"),
        };
      }
    }

    return null;
  }, [orders, id]);

  // 판매자 정보를 비동기로 로드하여 업데이트
  useEffect(() => {
    const loadSellerInfo = async () => {
      if (!currentReviewData) {
        setIsReviewDataLoading(false);
        return;
      }

      try {
        // orderToReviewItems를 사용하여 판매자 정보 가져오기
        const order = orders.find((o) => o._id === currentReviewData.orderId);
        if (order) {
          const reviewItems = await orderToReviewItems(order);
          const reviewItem = reviewItems.find((item) => item.id === currentReviewData.id);

          if (reviewItem) {
            setReviewData({
              ...currentReviewData,
              author: reviewItem.author,
              sellerProfileImage: reviewItem.sellerProfileImage,
              location: reviewItem.location, // 판매자 주소 정보 업데이트
            });
          } else {
            setReviewData(currentReviewData);
          }
        } else {
          setReviewData(currentReviewData);
        }
      } catch (error) {
        console.error("판매자 정보 로딩 오류:", error);
        setReviewData(currentReviewData);
      } finally {
        setIsReviewDataLoading(false);
      }
    };

    loadSellerInfo();
  }, [currentReviewData, orders]);

  // 별점 클릭 핸들러 최적화
  const handleStarClick = useCallback((starIndex: number) => {
    setRating(starIndex + 1);
  }, []);

  // 사용자가 리뷰를 성공적으로 제출했을 때, 해당 상품의 product_id를 localStorage에 추가합니다
  const updateReviewedProductIdsInLocalStorage = useCallback((productId: number) => {
    const reviewedProductIds = JSON.parse(localStorage.getItem("pendingReviewedIds") || "[]");
    if (!reviewedProductIds.includes(productId)) {
      reviewedProductIds.push(productId);
      localStorage.setItem("pendingReviewedIds", JSON.stringify(reviewedProductIds));
    }
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!reviewData || isSubmitting || !user?.token?.accessToken || reviewData.orderId === 0) return;

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
  }, [reviewData, isSubmitting, user?.token?.accessToken, rating, router, updateReviewedProductIdsInLocalStorage]);

  // useEffect 제거하고 직접 데이터 사용
  // (이미 위에서 currentReviewData를 설정하는 useEffect가 있음)

  if (isLoading || isReviewDataLoading) {
    return (
      <div className="min-h-screen bg-uni-white flex items-center justify-center">
        <div className="text-uni-gray-400 font-pretendard">상품 정보를 불러오는 중...</div>
      </div>
    );
  }

  if (purchasedItemsError || !currentReviewData) {
    return (
      <div className="min-h-screen bg-uni-white flex items-center justify-center">
        <div className="text-uni-gray-400 font-pretendard">상품 정보를 불러올 수 없습니다.</div>
      </div>
    );
  }

  // 렌더링할 데이터 결정 (reviewData가 있으면 사용, 없으면 currentReviewData 사용)
  const displayData = reviewData || currentReviewData;

  return (
    <>
      <Head>
        <title>리뷰 작성 - {displayData?.title || "상품"} | UNISTUFF</title>
        <meta name="description" content={`${displayData?.title || "상품"}에 대한 거래 후기를 작성하세요.`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="min-h-screen bg-uni-white relative">
        <main className="p-4 space-y-6" role="main">
          {/* 거래 완료 섹션 */}
          <section
            className="bg-uni-gray-100 rounded-lg p-4 shadow"
            role="region"
            aria-labelledby="transaction-complete"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-10 text-uni-gray-400 mb-1 font-pretendard" id="transaction-complete">
                  거래 완료
                </p>
                <h1 className="text-14 font-semibold text-uni-black mb-1 font-pretendard">
                  {displayData?.title || "상품 정보"}
                </h1>
                <time className="text-10 text-uni-gray-400 font-pretendard" dateTime={displayData?.date}>
                  {displayData?.date || "날짜 정보 없음"}
                </time>
              </div>
              <div className="ml-4">
                <div className="w-30 h-20 bg-uni-gray-100 rounded-lg overflow-hidden relative">
                  <Image
                    src={displayData?.image || "/assets/defaultimg.png"}
                    alt={`${displayData?.title || "상품"} 상품 이미지`}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 120px, 120px"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* 판매자/리뷰어 정보 섹션 */}
          <section className="flex items-center space-x-3 py-2" role="region" aria-labelledby="seller-info">
            <div className="w-10 h-10 bg-uni-gray-100 rounded-full overflow-hidden relative">
              {displayData?.sellerProfileImage && displayData.sellerProfileImage !== "/assets/defaultimg.png" ? (
                <Image
                  src={displayData.sellerProfileImage}
                  alt={`${displayData.author} 프로필 사진`}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              ) : (
                <div
                  className="flex items-center justify-center w-full h-full text-uni-gray-400"
                  aria-label={`${displayData?.author || "판매자"} 프로필`}
                >
                  {(displayData?.author || "판매자").charAt(0)}
                </div>
              )}
            </div>
            <div>
              <h2 className="text-14 font-semibold text-uni-black font-pretendard" id="seller-info">
                {displayData?.author || "판매자"}
              </h2>
              <p className="text-10 text-uni-gray-400 font-pretendard">{displayData?.location || "위치 정보 없음"}</p>
            </div>
          </section>

          {/* 별점 평가 섹션 */}
          <section className="py-3" role="region" aria-labelledby="rating-section">
            <h3 className="sr-only" id="rating-section">
              별점 평가
            </h3>
            <div className="flex space-x-1 justify-start" role="radiogroup" aria-labelledby="rating-section">
              {[0, 1, 2, 3, 4].map((starIndex) => (
                <button
                  key={starIndex}
                  onClick={() => handleStarClick(starIndex)}
                  className="p-1 focus:outline-none focus:ring-2 focus:ring-uni-blue-400 focus:ring-offset-2 rounded"
                  role="radio"
                  aria-checked={starIndex < rating}
                  aria-label={`${starIndex + 1}점`}
                  type="button"
                >
                  <Star
                    className={`w-7 h-7 transition-colors ${starIndex < rating ? "text-yellow-400 fill-yellow-400" : "text-uni-gray-300"}`}
                  />
                </button>
              ))}
            </div>
            <p className="sr-only" aria-live="polite">
              현재 선택된 별점: {rating}점
            </p>
          </section>

          {/* 리뷰 작성 textarea */}
          <section className="mt-6">
            <label htmlFor="review-textarea" className="sr-only">
              리뷰 내용 작성
            </label>
            <textarea
              id="review-textarea"
              ref={reviewTextareaRef}
              className="w-full h-40 p-4 border border-uni-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-uni-blue-400 focus:border-transparent text-14 font-pretendard transition-colors"
              rows={8}
              placeholder="거래 후기를 작성해주세요. (선택사항)"
              aria-describedby="review-guidelines"
            />
          </section>

          {/* 안내 문구 */}
          <section className="mt-4 mb-28">
            <p className="text-10 text-uni-gray-300 leading-relaxed font-pretendard" id="review-guidelines">
              다른 사용자에게 불쾌감을 줄 수 있는 리뷰는 법적조치를 받을 수 있습니다
            </p>
          </section>
        </main>

        {/* 등록 버튼 */}
        <SaveFloatingButton onClick={handleSubmit}>등록하기</SaveFloatingButton>
      </div>
    </>
  );
}
