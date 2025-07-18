//my-post와 로직 동일
"use client";

import { useState } from "react";
import TabNavigation from "../../_components/TabNavigation";
import ItemCard, { Item } from "../../_components/ItemCard";
import EmptyState from "../../_components/EmptyState";
import { myPageWishlistData, MyPageWishlist } from "../../data/wishlistData";

export default function MyPageMyPost() {
  const [activeTab, setActiveTab] = useState("전체");

  // reviewsData에서 카테고리별로 필터링
  const sellItems: Item[] = myPageWishlistData
    .filter((item: MyPageWishlist) => item.category === "팔래요")
    .map((item: MyPageWishlist) => ({
      id: item.id,
      title: item.title,
      price: item.price,
      image: item.image,
      status: item.status,
    }));

  const buyItems: Item[] = myPageWishlistData
    .filter((item: MyPageWishlist) => item.category === "살래요")
    .map((item: MyPageWishlist) => ({
      id: item.id,
      title: item.title,
      price: item.price,
      image: item.image,
      status: item.status,
    }));

  const gatheringsItems: Item[] = myPageWishlistData
    .filter((item: MyPageWishlist) => item.category === "모여요")
    .map((item: MyPageWishlist) => ({
      id: item.id,
      title: item.title,
      price: item.price,
      image: item.image,
      status: item.status,
    }));

  const tabs = ["전체", "팔래요", "살래요", "모여요"];

  return (
    <div className="min-h-screen bg-uni-white">
      {/* Tab Navigation */}
      <TabNavigation tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="p-4 space-y-6">
        {/* 팔래요 Section */}
        {(activeTab === "전체" || activeTab === "팔래요") && (
          <section>
            <h2 className="text-20 font-semibold mb-3 text-uni-black font-pretendard">팔고싶어요</h2>
            <div className="space-y-3">
              {sellItems.length > 0 ? (
                sellItems.map((item) => <ItemCard key={item.id} item={item} />)
              ) : (
                <EmptyState message="아직 거래한게 없어요" />
              )}
            </div>
          </section>
        )}

        {/* 살래요 Section */}
        {(activeTab === "전체" || activeTab === "살래요") && (
          <section>
            <h2 className="text-20 font-semibold mb-3 text-uni-black font-pretendard">사고싶어요</h2>
            <div className="space-y-3">
              {buyItems.length > 0 ? (
                buyItems.map((item) => <ItemCard key={item.id} item={item} />)
              ) : (
                <EmptyState message="아직 거래한게 없어요" />
              )}
            </div>
          </section>
        )}

        {/* 모여요 Section */}
        {(activeTab === "전체" || activeTab === "모여요") && (
          <section>
            <h2 className="text-20 font-semibold mb-3 text-uni-black font-pretendard">모여요</h2>
            <div className="space-y-3">
              {gatheringsItems.length > 0 ? (
                gatheringsItems.map((item) => <ItemCard key={item.id} item={item} />)
              ) : (
                <EmptyState message="아직 거래한게 없어요" />
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
