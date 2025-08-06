"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { useUserStore } from "@/store/userStore";
import UserProfileHeader from "./UserProfileHeader";
import UserRating from "./UserRating";
import { Post } from "@/types";

export interface SellerInfo {
  _id: number;
  name: string;
  image?: string;
  address?: string;
}

export interface RatingData {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: { [key: number]: number };
}

interface UserPostsData {
  sell: Post[];
  buy: Post[];
  groupPurchase: Post[];
}

interface UserProfileContainerProps {
  userId: string;
  userInfoPromise: Promise<SellerInfo | null>;
  userPostsPromise: Promise<UserPostsData>;
}

export default function UserProfileContainer({ userId, userInfoPromise, userPostsPromise }: UserProfileContainerProps) {
  const router = useRouter();
  const { user } = useUserStore();
  const isCurrentUser = user?._id === parseInt(userId);

  const sellerInfo = use(userInfoPromise);
  const userPosts = use(userPostsPromise);

  const [purchaseCount, setPurchaseCount] = useState<number>(0);
  const [ratingData /*setRatingData*/] = useState<RatingData>({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  });

  // 게시글 수 계산
  const sellPostsCount = userPosts.sell.length;
  const buyPostsCount = userPosts.buy.length;
  const groupPurchasePostsCount = userPosts.groupPurchase.length;

  useEffect(() => {
    async function fetchData() {
      if (isCurrentUser && user?.token?.accessToken) {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/`, {
            headers: {
              "Client-Id": process.env.NEXT_PUBLIC_CLIENT_ID || "",
              Authorization: `Bearer ${user.token.accessToken}`,
            },
          });
          if (res.ok) setPurchaseCount((await res.json()).pagination.total);
        } catch (error) {
          console.error("Failed to fetch user purchases:", error);
        }
      }
    }
    fetchData();
  }, [isCurrentUser, user?.token?.accessToken]);

  const getUserImageUrl = (imagePath: string | null | undefined): string => {
    if (!imagePath) return "/assets/defaultimg.png";
    if (imagePath.startsWith("http")) return imagePath;
    return `${process.env.NEXT_PUBLIC_API_URL}/${imagePath}`;
  };

  const getRatingPercentage = (rating: number): number => {
    if (ratingData.totalReviews === 0) return 0;
    return Math.round((ratingData.ratingDistribution[rating] / ratingData.totalReviews) * 100);
  };

  if (!sellerInfo) {
    return <div>사용자 정보를 불러올 수 없습니다.</div>;
  }

  return (
    <div className="w-full bg-uni-white text-uni-black font-sans">
      <header className="bg-uni-white px-3 py-2 sticky top-0 z-10">
        <div className="flex items-center justify-between h-11">
          <button onClick={() => router.back()} className="p-2 -ml-2 flex items-center justify-center">
            <ChevronLeft className="w-6 h-6 text-uni-gray-600" />
          </button>
          <h2 className="absolute left-1/2 -translate-x-1/2 text-18 font-semibold text-uni-black font-pretendard">
            판매자 프로필
          </h2>
          <div className="w-10 h-10"></div>
        </div>
      </header>
      <UserProfileHeader
        sellerInfo={sellerInfo}
        sellPostsCount={sellPostsCount}
        buyPostsCount={buyPostsCount}
        groupPurchasePostsCount={groupPurchasePostsCount}
        purchaseCount={purchaseCount}
        getUserImageUrl={getUserImageUrl}
      />
      <UserRating ratingData={ratingData} getRatingPercentage={getRatingPercentage} />
    </div>
  );
}
