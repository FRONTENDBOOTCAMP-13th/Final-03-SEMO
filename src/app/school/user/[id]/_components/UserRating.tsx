"use client";

import { Star } from "lucide-react";
import { RatingData } from "./UserProfileContainer";

interface UserRatingProps {
  ratingData: RatingData;
  getRatingPercentage: (rating: number) => number;
}

export default function UserRating({ ratingData, getRatingPercentage }: UserRatingProps) {
  return (
    <div className="px-6 py-4">
      {/* 메인 평점 정보 */}
      <div className="flex mb-4">
        <div className="mr-6">
          <div className="text-4xl font-bold mb-1">{ratingData.averageRating.toFixed(1)}</div>
          <div className="flex mb-1">
            {[1, 2, 3, 4, 5].map((star) => {
              const isFullStar = star <= Math.floor(ratingData.averageRating);
              const isHalfStar = star === Math.ceil(ratingData.averageRating) && ratingData.averageRating % 1 !== 0;

              if (isFullStar) {
                return <Star key={star} size={16} fill="currentColor" className="text-yellow-400" />;
              } else if (isHalfStar) {
                return (
                  <div key={star} className="relative">
                    <Star size={16} className="text-uni-gray-300" fill="currentColor" />
                    <Star
                      size={16}
                      className="absolute top-0 left-0 text-yellow-400 overflow-hidden"
                      style={{ width: "50%" }}
                      fill="currentColor"
                    />
                  </div>
                );
              } else {
                return <Star key={star} size={16} className="text-uni-gray-300" fill="currentColor" />;
              }
            })}
          </div>
          <div className="text-sm text-uni-gray-500">{ratingData.totalReviews} 평가</div>
        </div>

        {/* 별점 분포 */}
        <div className="flex-1 space-y-1">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center text-sm">
              <span className="w-2 mr-3 text-center">{rating}</span>
              <div className="flex-1 h-2 bg-uni-gray-200 rounded-full overflow-hidden mx-2">
                <div
                  className="bg-yellow-400 h-full rounded-full"
                  style={{ width: `${getRatingPercentage(rating)}%` }}
                />
              </div>
              <span className="w-8 text-right text-uni-gray-500 text-xs">{getRatingPercentage(rating)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
