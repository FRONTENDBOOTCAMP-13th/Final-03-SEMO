import { SellerReviewItem } from '@/data/functions/sellerReviews';
import ClientReviewList from './ClientReviewList';

async function ReviewListSection({ userReviewsPromise }: { userReviewsPromise: Promise<SellerReviewItem[]> }) {
  const reviews = await userReviewsPromise;

  return (
    <ClientReviewList
      reviews={reviews}
    />
  );
}

export default ReviewListSection;
