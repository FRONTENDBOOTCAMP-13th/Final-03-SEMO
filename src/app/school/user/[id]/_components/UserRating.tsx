'use client';

import { Star } from 'lucide-react';
import { RatingData } from './UserProfileContainer';

interface UserRatingProps {
  ratingData: RatingData;
  getRatingPercentage: (rating: number) => number;
}

export default function UserRating({ ratingData, getRatingPercentage }: UserRatingProps) {
  return (
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
                    style={{ width: '50%' }}
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
  );
}
