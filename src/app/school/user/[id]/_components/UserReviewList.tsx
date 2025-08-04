'use client';

import Image from 'next/image';
import { Star } from 'lucide-react';
import { SellerReviewItem } from '@/data/functions/sellerReviews';

interface UserReviewListProps {
  reviews: SellerReviewItem[];
  handleReviewerProfileClick: (reviewerId: number) => void;
  getUserImageUrl: (path: string | null | undefined) => string;
  maskUserName: (name: string) => string;
}

export default function UserReviewList({
  reviews,
  handleReviewerProfileClick,
  getUserImageUrl,
  maskUserName,
}: UserReviewListProps) {
  return (
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
                      {new Date(reply.createdAt).toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
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
                      className={`inline-block ${star <= reply.rating ? 'text-yellow-400' : 'text-uni-gray-300'}`}
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
  );
}
