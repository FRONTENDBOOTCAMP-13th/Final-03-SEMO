'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { getSellerReviews, SellerReviewItem } from '@/data/functions/sellerReviews';
import { useUserStore } from '@/store/userStore';
import { Post } from '@/types';

import UserProfileHeader from './UserProfileHeader';
import UserRating from './UserRating';
import UserPostList from './UserPostList';
import UserReviewList from './UserReviewList';

export interface SellerInfo {
  _id: number;
  name: string;
  image?: string;
  address?: string;
  posts?: number;
}

export interface RatingData {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    [key: number]: number;
  };
}

export default function UserProfileContainer({ userId }: { userId: string }) {
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

  const fetchAllData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const headers: HeadersInit = {
        'Client-Id': process.env.NEXT_PUBLIC_CLIENT_ID || '',
      };
      if (isCurrentUser && user?.token?.accessToken) {
        headers['Authorization'] = `Bearer ${user.token.accessToken}`;
      }

      // 모든 fetch를 병렬로 실행
      const [userInfoRes, sellRes, buyRes, groupPurchaseRes, reviewsResponse, purchasesRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`, { headers }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/users/${userId}?type=sell`, { headers }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/users/${userId}?type=buy`, { headers }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/users/${userId}?type=groupPurchase`, { headers }),
        getSellerReviews(userId),
        isCurrentUser && user?.token?.accessToken
          ? fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/`, { headers })
          : Promise.resolve(null),
      ]);

      // 사용자 정보 처리
      if (userInfoRes.ok) {
        const data = await userInfoRes.json();
        if (data.ok && data.item) setSellerInfo(data.item);
      }

      // 게시물 정보 처리
      if (sellRes.ok) {
        const data = await sellRes.json();
        if (data.ok && data.item) setSellPosts(data.item);
      }
      if (buyRes.ok) {
        const data = await buyRes.json();
        if (data.ok && data.item) setBuyPosts(data.item);
      }
      if (groupPurchaseRes.ok) {
        const data = await groupPurchaseRes.json();
        if (data.ok && data.item) setGroupPurchasePosts(data.item);
      }

      // 후기 및 평점 처리
      if (reviewsResponse.ok && reviewsResponse.item) {
        setReviews(reviewsResponse.item);
        const allRatings = reviewsResponse.item.flatMap((p) => p.replies.map((r) => r.rating));
        const totalReviews = allRatings.length;
        const averageRating = totalReviews > 0 ? Math.round((allRatings.reduce((s, r) => s + r, 0) / totalReviews) * 10) / 10 : 0;
        const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        allRatings.forEach((rating) => { distribution[rating as keyof typeof distribution]++; });
        setRatingData({ averageRating, totalReviews, ratingDistribution: distribution });
      } else {
        setError('후기 데이터를 불러올 수 없습니다.');
      }

      // 구매 정보 처리
      if (purchasesRes && purchasesRes.ok) {
        const data = await purchasesRes.json();
        if (data.ok && data.pagination) setPurchaseCount(data.pagination.total);
      } else {
        setPurchaseCount(0);
      }

    } catch (err) {
      setError('데이터를 불러오는 중 오류가 발생했습니다.');
      console.error('데이터 로딩 오류:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchAllData();
    }
  }, [userId, isCurrentUser]);

  // Helper Functions
  const maskUserName = (name: string): string => {
    if (name.length <= 1) return name;
    if (name.length === 2) return name[0] + '*';
    return name[0] + '*'.repeat(name.length - 2) + name[name.length - 1];
  };

  const getUserImageUrl = (imagePath: string | null | undefined): string => {
    if (!imagePath) return '/assets/defaultimg.png';
    if (imagePath.startsWith('http')) return imagePath;
    return `${process.env.NEXT_PUBLIC_API_URL}/${imagePath}`;
  };

  const getRatingPercentage = (rating: number): number => {
    if (ratingData.totalReviews === 0) return 0;
    return Math.round((ratingData.ratingDistribution[rating] / ratingData.totalReviews) * 100);
  };

  const handleReviewerProfileClick = (reviewerId: number) => {
    router.push(`/school/user/${reviewerId}`);
  };

  const getProductImagePath = (productImages: any) => {
    if (Array.isArray(productImages) && productImages.length > 0) {
      const firstImage = productImages[0];
      if (typeof firstImage === 'object' && firstImage.path) return firstImage.path;
      if (typeof firstImage === 'string') return firstImage;
    }
    if (typeof productImages === 'string') return productImages;
    return '';
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
        <button onClick={fetchAllData} className="px-6 py-3 bg-uni-blue-400 text-uni-white rounded-lg font-medium">
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

      <UserProfileHeader
        sellerInfo={sellerInfo}
        sellPostsCount={sellPosts.length}
        buyPostsCount={buyPosts.length}
        groupPurchasePostsCount={groupPurchasePosts.length}
        purchaseCount={purchaseCount}
        getUserImageUrl={getUserImageUrl}
      />

      <UserRating ratingData={ratingData} getRatingPercentage={getRatingPercentage} />

      <UserPostList
        sellPosts={sellPosts}
        buyPosts={buyPosts}
        groupPurchasePosts={groupPurchasePosts}
        getProductImagePath={getProductImagePath}
      />

      <UserReviewList
        reviews={reviews}
        handleReviewerProfileClick={handleReviewerProfileClick}
        getUserImageUrl={getUserImageUrl}
        maskUserName={maskUserName}
      />
    </div>
  );
}
