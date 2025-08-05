import { SellerReviewItem } from '@/data/functions/sellerReviews';
import ClientReviewList from './ClientReviewList';

async function ReviewListSection({ userReviewsPromise }: { userReviewsPromise: Promise<SellerReviewItem[]> }) {
  const reviews = await userReviewsPromise;

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

  return (
    <ClientReviewList
      reviews={reviews}
      getUserImageUrl={getUserImageUrl}
      maskUserName={maskUserName}
    />
  );
}

export default ReviewListSection;
