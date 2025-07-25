//my-post와 로직 동일
"use client";

import { useState } from "react";
import TabNavigation from "../../_components/TabNavigation";
import ItemCard, { Item } from "../../_components/ItemCard";
import EmptyState from "../../_components/EmptyState";
import { myPageWishlistData, MyPageWishlist } from "../../data/wishlistData";

export default function MyPageMyPost() {
  const [activeTab, setActiveTab] = useState("전체");

  // 컴포넌트가 로드되는지 확인
  console.log("🌟 MyPageWishlist 컴포넌트 시작!");

  // API로부터 북마크 목록 가져오기
  const { bookmarks, isLoading, error, refetch } = useMyBookmarks();

  // 디버깅을 위한 콘솔 로그
  console.log(`🎯 [Wishlist] 페이지 로드됨`);
  console.log(`🎯 [Wishlist] bookmarks 배열:`, bookmarks);
  console.log(`🎯 [Wishlist] bookmarks 길이:`, bookmarks?.length || 0);
  console.log(`🎯 [Wishlist] isLoading:`, isLoading);
  console.log(`🎯 [Wishlist] error:`, error);

  // API 데이터를 위시리스트 아이템 형식으로 변환
  const wishlistItems = useMemo(() => {
    console.log(`🔄 [Wishlist] bookmarks 변환 시작:`, bookmarks);
    const items = bookmarksToWishlistItems(bookmarks);
    console.log(`🔄 [Wishlist] 변환 완료:`, items);
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
