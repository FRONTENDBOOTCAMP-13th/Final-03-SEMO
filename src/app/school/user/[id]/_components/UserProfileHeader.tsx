'use client';

import Image from 'next/image';
import { SellerInfo } from './UserProfileContainer';

interface UserProfileHeaderProps {
  sellerInfo: SellerInfo | null;
  sellPostsCount: number;
  buyPostsCount: number;
  groupPurchasePostsCount: number;
  purchaseCount: number;
  getUserImageUrl: (path: string | null | undefined) => string;
}

export default function UserProfileHeader({
  sellerInfo,
  sellPostsCount,
  buyPostsCount,
  groupPurchasePostsCount,
  purchaseCount,
  getUserImageUrl,
}: UserProfileHeaderProps) {
  return (
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
      <h2 className="text-xl font-bold mb-1">{sellerInfo?.name || '사용자'}</h2>
      <p className="text-uni-gray-500 text-sm mb-1">{sellerInfo?.address || '기숙사'}</p>
      <p className="text-uni-gray-500 text-sm">
        판매{sellPostsCount + buyPostsCount + groupPurchasePostsCount} 구매{purchaseCount}
      </p>
    </div>
  );
}
