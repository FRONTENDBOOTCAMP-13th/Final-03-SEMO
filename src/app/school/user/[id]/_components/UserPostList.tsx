"use client";

import ProductCard from "@/app/school/user/[id]/_components/ProductCard";
import { Post } from "@/types";

interface UserPostListProps {
  sellPosts: Post[];
  buyPosts: Post[];
  groupPurchasePosts: Post[];
  getProductImagePath: (productImages: any) => string;
}

export default function UserPostList({
  sellPosts,
  buyPosts,
  groupPurchasePosts,
  getProductImagePath,
}: UserPostListProps) {
  const allPosts = [...sellPosts, ...buyPosts, ...groupPurchasePosts];

  return (
    <div className="px-6 pt-4 pb-6">
      <h3 className="text-lg font-bold mb-4">게시물</h3>
      {allPosts.length > 0 ? (
        <div className="overflow-x-auto hide-scrollbar">
          <div
            className="flex gap-4 pb-2"
            style={{
              width: `${Math.max(allPosts.length * 180, 100)}px`,
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
  );
}
