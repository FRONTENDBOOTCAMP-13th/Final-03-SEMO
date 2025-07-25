//my-post와 로직 동일
"use client";

import { useState, useMemo } from "react";
import TabNavigation from "../../_components/TabNavigation";
import ItemCard, { Item } from "../../_components/ItemCard";
import EmptyState from "../../_components/EmptyState";
import { useMyBookmarks } from "../../_hooks/useHistoryApi";
import { bookmarksToWishlistItems } from "../../_utils/postConverter";

export default function MyPageWishlist() {
  const [activeTab, setActiveTab] = useState("전체");

  // 컴포넌트가 로드되는지 확인
  console.log("🌟 MyPageWishlist 컴포넌트 시작!");

  // API로부터 북마크 목록 가져오기
  const { bookmarks, isLoading, error, refetch } = useMyBookmarks();

  // API 데이터를 위시리스트 아이템 형식으로 변환
  const wishlistItems = useMemo(() => {
    console.log(`🔄 [Wishlist] bookmarks 변환 시작:`, bookmarks);
    const items = bookmarksToWishlistItems(bookmarks);
    console.log(`🔄 [Wishlist] 변환된 아이템 수:`, items.length);
    return items;
  }, [bookmarks]);

  // 카테고리별로 필터링
  const sellItems: Item[] = wishlistItems
    .filter((item) => item.category === "팔래요")
    .map((item) => ({
      id: item.id,
      title: item.title,
      price: item.price,
      image: item.image,
      status: item.status,
    }));

  const buyItems: Item[] = wishlistItems
    .filter((item) => item.category === "살래요")
    .map((item) => ({
      id: item.id,
      title: item.title,
      price: item.price,
      image: item.image,
      status: item.status,
    }));

  const gatheringsItems: Item[] = wishlistItems
    .filter((item) => item.category === "모여요")
    .map((item) => ({
      id: item.id,
      title: item.title,
      price: item.price,
      image: item.image,
      status: item.status,
    }));

  const tabs = ["전체", "팔래요", "살래요", "모여요"];

  // 로딩 상태 처리
  if (isLoading) {
    return (
      <div className="min-h-screen bg-uni-white">
        <TabNavigation tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex items-center justify-center py-20">
          <div className="text-uni-gray-400 font-pretendard">북마크 목록을 불러오는 중...</div>
        </div>
      </div>
    );
  }

  // 에러 상태 처리
  if (error) {
    return (
      <div className="min-h-screen bg-uni-white">
        <TabNavigation tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="text-uni-gray-400 font-pretendard">{error}</div>
          <button onClick={refetch} className="px-4 py-2 bg-uni-blue text-white rounded-lg font-pretendard">
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-uni-white">
      {/* Tab Navigation */}
      <TabNavigation tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="p-4 space-y-6 pb-24">
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
