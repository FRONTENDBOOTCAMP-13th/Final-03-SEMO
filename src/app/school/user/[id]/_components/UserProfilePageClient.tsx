"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Star, ChevronLeft } from "lucide-react";
import { getSellerReviews, SellerReviewItem } from "@/data/functions/sellerReviews";
import ProductCard from "@/components/ui/ProductCard";
import { useUserStore } from "@/store/userStore";
import { Post } from "@/types";

// 판매자 정보 인터페이스
interface SellerInfo {
  _id: number;
  name: string;
  image?: string;
  address?: string;
  posts?: number; // 판매 게시물 수
}

// 평점 데이터 인터페이스
interface RatingData {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    [key: number]: number; // 1-5점별 개수
  };
}

export default function UserProfilePageClient({ userId }: { userId: string }) {
  const router = useRouter();
  const { user } = useUserStore();

  const isCurrentUser = user?._id === parseInt(userId);

  const [sellerInfo, setSellerInfo] = useState<SellerInfo | null>(null);
  const [reviews, setReviews] = useState<SellerReviewItem[]>([]);
  const [sellPosts, setSellPosts] = useState<Post[]>([]);
  const [buyPosts, setBuyPosts] = useState<Post[]>([]);
  const [groupPurchasePosts, setGroupPurchasePosts] = useState<Post[]>([]);
  const [purchaseCount, setPurchaseCount] = useState<number>(0);
  const [ratingData, setRatingData] = useState<RatingData>({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 사용자 정보 가져오기
  const fetchUserInfo = async (userId: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`, {
        headers: {
          "Client-Id": process.env.NEXT_PUBLIC_CLIENT_ID || "",
        },
      });

      if (res.ok) {
        const data = await res.json();
        if (data.ok && data.item) {
          setSellerInfo(data.item);
        }
      }
    } catch (error) {
      console.error("사용자 정보 로딩 실패:", error);
    }
  };

  // 사용자 게시물 가져오기
  const fetchUserPosts = async (userId: string) => {
    try {
      const headers: HeadersInit = {
        "Client-Id": process.env.NEXT_PUBLIC_CLIENT_ID || "",
      };

      if (isCurrentUser && user?.token?.accessToken) {
        headers["Authorization"] = `Bearer ${user.token.accessToken}`;
      }

      const [sellRes, buyRes, groupPurchaseRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/users/${userId}?type=sell`, { headers }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/users/${userId}?type=buy`, { headers }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/users/${userId}?type=groupPurchase`, { headers }),
      ]);

      if (sellRes.ok) {
        const sellData = await sellRes.json();
        if (sellData.ok && sellData.item) setSellPosts(sellData.item);
      }

      if (buyRes.ok) {
        const buyData = await buyRes.json();
        if (buyData.ok && buyData.item) setBuyPosts(buyData.item);
      }

      if (groupPurchaseRes.ok) {
        const groupData = await groupPurchaseRes.json();
        if (groupData.ok && groupData.item) setGroupPurchasePosts(groupData.item);
      }
    } catch (error) {
      console.error("사용자 게시물 로딩 실패:", error);
    }
  };

  // 사용자 구매 정보 가져오기
  const fetchUserPurchases = async () => {
    if (!isCurrentUser || !user?.token?.accessToken) {
      setPurchaseCount(0);
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/`, {
        headers: {
          "Client-Id": process.env.NEXT_PUBLIC_CLIENT_ID || "",
          Authorization: `Bearer ${user.token.accessToken}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        if (data.ok && data.pagination) {
          setPurchaseCount(data.pagination.total);
        }
      }
    } catch (error) {
      console.error("사용자 구매 정보 로딩 실패:", error);
      setPurchaseCount(0);
    }
  };

  // 후기 데이터 가져오기 및 평점 계산
  const fetchReviewsData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const reviewsResponse = await getSellerReviews(userId);

      if (reviewsResponse.ok && reviewsResponse.item) {
        setReviews(reviewsResponse.item);

        const allRatings = reviewsResponse.item.flatMap((product) => product.replies.map((reply) => reply.rating));
        const totalReviews = allRatings.length;
        const averageRating =
          totalReviews > 0
            ? Math.round((allRatings.reduce((sum, rating) => sum + rating, 0) / totalReviews) * 10) / 10
            : 0;

        const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        allRatings.forEach((rating) => {
          distribution[rating as keyof typeof distribution]++;
        });

        setRatingData({
          averageRating,
          totalReviews,
          ratingDistribution: distribution,
        });
      } else {
        setError("후기 데이터를 불러올 수 없습니다.");
      }
    } catch (error) {
      setError("데이터를 불러오는 중 오류가 발생했습니다.");
      console.error("후기 데이터 로딩 오류:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserInfo(userId);
      fetchUserPosts(userId);
      fetchUserPurchases();
      fetchReviewsData();
    }
  }, [userId, isCurrentUser]); // isCurrentUser를 의존성 배열에 추가

  // 이름 마스킹 함수
  const maskUserName = (name: string): string => {
    if (name.length <= 1) return name;
    if (name.length === 2) return name[0] + "*";
    return name[0] + "*".repeat(name.length - 2) + name[name.length - 1];
  };

  // 이미지 URL 생성
  const getUserImageUrl = (imagePath: string | null | undefined): string => {
    if (!imagePath) return "/assets/defaultimg.png";
    if (imagePath.startsWith("http")) return imagePath;
    return `${process.env.NEXT_PUBLIC_API_URL}/${imagePath}`;
  };

  // 평점 퍼센티지 계산
  const getRatingPercentage = (rating: number): number => {
    if (ratingData.totalReviews === 0) return 0;
    return Math.round((ratingData.ratingDistribution[rating] / ratingData.totalReviews) * 100);
  };

  // 후기자 프로필 클릭 핸들러
  const handleReviewerProfileClick = (reviewerId: number) => {
    router.push(`/school/user/${reviewerId}`);
  };

  // 이미지 경로 처리 함수
  const getProductImagePath = (productImages: any) => {
    if (Array.isArray(productImages) && productImages.length > 0) {
      const firstImage = productImages[0];
      if (typeof firstImage === "object" && firstImage.path) {
        return firstImage.path;
      }
      if (typeof firstImage === "string") {
        return firstImage;
      }
    }
    if (typeof productImages === "string") {
      return productImages;
    }
    return "";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-uni-white flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-transparent border-t-uni-blue-400 border-r-uni-blue-400 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-uni-white flex flex-col items-center justify-center p-4">
        <p className="text-uni-gray-600 mb-4 text-center">{error}</p>
        <button
          onClick={() => fetchReviewsData()}
          className="px-6 py-3 bg-uni-blue-400 text-uni-white rounded-lg font-medium"
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-uni-white text-uni-black font-sans">
      <header className="bg-uni-white px-3 py-2 sticky top-0 z-10">
        <div className="flex items-center justify-between h-11">
          <button onClick={() => router.back()} className="p-2 -ml-2 flex items-center justify-center">
            <ChevronLeft className="w-6 h-6 text-uni-gray-600" />
          </button>
          <h1 className="absolute left-1/2 -translate-x-1/2 text-18 font-semibold text-uni-black font-pretendard">
            판매자 프로필
          </h1>
          <div className="w-10 h-10"></div>
        </div>
      </header>

      {/* Profile Section */}
      <div className="flex flex-col items-center py-6">
        <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
          <Image
            src={getUserImageUrl(sellerInfo?.image)}
            alt="프로필 이미지"
            width={96}
            height={96}
            className="w-full h-full object-cover"
          />
        </div>
        <h2 className="text-xl font-bold mb-1">{sellerInfo?.name || "사용자"}</h2>
        <p className="text-uni-gray-500 text-sm mb-1">{sellerInfo?.address || "기숙사"}</p>
        <p className="text-uni-gray-500 text-sm">
          판매{sellPosts.length + buyPosts.length + groupPurchasePosts.length} 구매{purchaseCount}
        </p>
      </div>

      {/* Rating Section */}
      <div className="px-6 py-4">
        <div className="flex items-baseline mb-2">
          <span className="text-3xl font-bold mr-4">{ratingData.averageRating.toFixed(1)}</span>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => {
              const isFullStar = star <= Math.floor(ratingData.averageRating);
              const isHalfStar = star === Math.ceil(ratingData.averageRating) && ratingData.averageRating % 1 !== 0;

              if (isFullStar) {
                return <Star key={star} size={20} fill="currentColor" className="text-yellow-400" />;
              } else if (isHalfStar) {
                return (
                  <div key={star} className="relative">
                    <Star size={20} className="text-uni-gray-300" fill="currentColor" />
                    <Star
                      size={20}
                      className="absolute top-0 left-0 text-yellow-400 overflow-hidden"
                      style={{ width: "50%" }}
                      fill="currentColor"
                    />
                  </div>
                );
              } else {
                return <Star key={star} size={20} className="text-uni-gray-300" fill="currentColor" />;
              }
            })}
          </div>
          <span className="text-uni-gray-500 ml-2">{ratingData.totalReviews} 평가</span>
        </div>

        <div className="space-y-1 mb-6">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center text-sm">
              <span className="w-4 mr-2">{rating}</span>
              <div className="flex-1 h-2 bg-uni-gray-200 rounded-full overflow-hidden">
                <div
                  className="bg-yellow-400 h-full rounded-full"
                  style={{ width: `${getRatingPercentage(rating)}%` }}
                />
              </div>
              <span className="w-10 text-right text-uni-gray-500 text-xs">{getRatingPercentage(rating)}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Products Section */}
      <div className="px-6 pt-4 pb-6">
        <h3 className="text-lg font-bold mb-4">게시물</h3>
        {sellPosts.length > 0 || buyPosts.length > 0 || groupPurchasePosts.length > 0 ? (
          <div className="overflow-x-auto hide-scrollbar">
            <div
              className="flex gap-4 pb-2"
              style={{
                width: `${Math.max((sellPosts.length + buyPosts.length + groupPurchasePosts.length) * 180, 100)}px`,
              }}
            >
              {sellPosts.map((product: Post) => (
                <div key={`sell-${product._id}`} className="flex-shrink-0">
                  <ProductCard
                    _id={product._id}
                    title={product.title}
                    extra={{ price: product.extra?.price || 0 }}
                    image={getProductImagePath(product.image)}
                    repliesCount={product.repliesCount || 0}
                    market="sell"
                    className="w-40"
                  />
                </div>
              ))}
              {buyPosts.map((product: Post) => (
                <div key={`buy-${product._id}`} className="flex-shrink-0">
                  <ProductCard
                    _id={product._id}
                    title={product.title}
                    extra={{ price: product.extra?.price || 0 }}
                    image={getProductImagePath(product.image)}
                    repliesCount={product.repliesCount || 0}
                    market="buy"
                    className="w-40"
                  />
                </div>
              ))}
              {groupPurchasePosts.map((product: Post) => (
                <div key={`group-${product._id}`} className="flex-shrink-0">
                  <ProductCard
                    _id={product._id}
                    title={product.title}
                    extra={{
                      price: product.extra?.price || 0,
                      participants: product.extra?.participants || 0,
                    }}
                    image={getProductImagePath(product.image)}
                    repliesCount={product.repliesCount || 0}
                    market="groupPurchase"
                    className="w-40"
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-uni-gray-500">아직 게시물이 없습니다.</p>
          </div>
        )}
      </div>

      {/* Reviews Section */}
      <div className="px-6 pt-6 pb-10">
        <h3 className="text-lg font-bold mb-4">거래 후기</h3>
        {reviews.length > 0 && reviews.some((product) => product.replies.length > 0) ? (
          <div className="space-y-4">
            {reviews.map((product) =>
              product.replies.map((reply) => (
                <div key={reply._id} className="pb-4 last:border-b-0">
                  <div className="flex items-center mb-2">
                    <button
                      onClick={() => handleReviewerProfileClick(reply.user._id)}
                      className="w-10 h-10 rounded-full mr-3 overflow-hidden "
                    >
                      <Image
                        src={getUserImageUrl(reply.user.image)}
                        alt="리뷰어 프로필"
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    </button>
                    <div>
                      <p className="font-medium">{maskUserName(reply.user.name)}</p>
                      <p className="text-xs text-uni-gray-500">
                        {new Date(reply.createdAt).toLocaleDateString("ko-KR", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={16}
                        fill="currentColor"
                        className={`inline-block ${star <= reply.rating ? "text-yellow-400" : "text-uni-gray-300"}`}
                      />
                    ))}
                  </div>
                  <p className="text-sm">{reply.content}</p>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-uni-gray-500">아직 거래 후기가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}