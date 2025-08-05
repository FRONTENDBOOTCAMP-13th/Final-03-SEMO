'use client';

import { useRouter } from 'next/navigation';
import { SellerReviewItem } from '@/data/functions/sellerReviews';
import UserReviewList from './UserReviewList';

interface ClientReviewListProps {
  reviews: SellerReviewItem[];
}

export default function ClientReviewList({ reviews }: ClientReviewListProps) {
  const router = useRouter();

  const getUserImageUrl = (imagePath: string | null | undefined): string => {
    if (!imagePath) return '/assets/defaultimg.png';
    if (imagePath.startsWith('http')) return imagePath;
    return `${process.env.NEXT_PUBLIC_API_URL}/${imagePath}`;
  };

  const maskUserName = (name: string): string => {
    if (name.length <= 1) return name;
    if (name.length === 2) return name[0] + '*';
    return name[0] + '*'.repeat(name.length - 2) + name[name.length - 1];
  };

  const handleReviewerProfileClick = (reviewerId: number) => {
    router.push(`/school/user/${reviewerId}`);
  };

  return (
    <UserReviewList
      reviews={reviews}
      handleReviewerProfileClick={handleReviewerProfileClick}
      getUserImageUrl={getUserImageUrl}
      maskUserName={maskUserName}
    />
  );
}
