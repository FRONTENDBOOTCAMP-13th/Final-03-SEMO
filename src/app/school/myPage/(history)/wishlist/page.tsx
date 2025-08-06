//my-post와 로직 동일
"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation"; // useRouter 임포트
import Head from "next/head";
import TabNavigation from "@/components/ui/TabNavigation";
import ItemCard, { Item } from "@/app/school/myPage/_components/ItemCard";
import EmptyState from "@/components/common/EmptyState";
import { useMyBookmarks } from "@/lib/hooks/useMyBookmarks";
import { bookmarksToWishlistItems } from "@/lib/utils/postConverter";
import SectionHeader from "@/components/common/SectionHeader";

export default function MyPageWishlist() {
  const [activeTab, setActiveTab] = useState("전체");
  const router = useRouter(); // useRouter 훅 사용

  // API로부터 북마크 목록 가져오기
  const { bookmarks, isLoading, error, refetch } = useMyBookmarks();

  const handleItemClick = (item: Item) => {
    // 동적 라우팅 경로 생성
    router.push(`/school/market/${item.marketType}/${item.id}`);
  };

  // API 데이터를 위시리스트 아이템 형식으로 변환
  const wishlistItems = useMemo(() => {
    const items = bookmarksToWishlistItems(bookmarks);
    return items;
  }, [bookmarks]);

  // myPageItems에서 카테고리별로 필터링
  const sellItems: Item[] = wishlistItems.filter((item) => item.marketType === "sell");

  const buyItems: Item[] = wishlistItems.filter((item) => item.marketType === "buy");

  const groupPurchaseItems: Item[] = wishlistItems.filter((item) => item.marketType === "groupPurchase");

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
    <>
      <Head>
        <title>UniStuff | 북마크</title>
        <meta name="description" content="찜한 목록을 확인" />
      </Head>
      <div className="min-h-screen bg-uni-white">
        {/* Tab Navigation */}
        <TabNavigation tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="p-4 space-y-6 pb-24">
        {/* 팔래요 Section */}
        {(activeTab === "전체" || activeTab === "팔래요") && (
          <section>
            {activeTab === "전체" ? (
              <SectionHeader title="팔고싶어요" targetTab="팔래요" onTabChange={setActiveTab} />
            ) : (
              <h2 className="text-20 font-semibold mb-3 text-uni-black font-pretendard">팔고싶어요</h2>
            )}
            <div className="space-y-3">
              {sellItems.length > 0 ? (
                (activeTab === "전체" ? sellItems.slice(0, 4) : sellItems).map((item) => (
                  <ItemCard key={item.id} item={item} onClick={handleItemClick} />
                ))
              ) : (
                <EmptyState message="아직 거래한게 없어요" />
              )}
            </div>
          </section>
        )}

        {/* 살래요 Section */}
        {(activeTab === "전체" || activeTab === "살래요") && (
          <section>
            {activeTab === "전체" ? (
              <SectionHeader title="사고싶어요" targetTab="살래요" onTabChange={setActiveTab} />
            ) : (
              <h2 className="text-20 font-semibold mb-3 text-uni-black font-pretendard">사고싶어요</h2>
            )}
            <div className="space-y-3">
              {buyItems.length > 0 ? (
                (activeTab === "전체" ? buyItems.slice(0, 4) : buyItems).map((item) => (
                  <ItemCard key={item.id} item={item} onClick={handleItemClick} />
                ))
              ) : (
                <EmptyState message="아직 거래한게 없어요" />
              )}
            </div>
          </section>
        )}

        {/* 모여요 Section */}
        {(activeTab === "전체" || activeTab === "모여요") && (
          <section>
            {activeTab === "전체" ? (
              <SectionHeader title="모여요" targetTab="모여요" onTabChange={setActiveTab} />
            ) : (
              <h2 className="text-20 font-semibold mb-3 text-uni-black font-pretendard">모여요</h2>
            )}
            <div className="space-y-3">
              {groupPurchaseItems.length > 0 ? (
                (activeTab === "전체" ? groupPurchaseItems.slice(0, 4) : groupPurchaseItems).map((item) => (
                  <ItemCard key={item.id} item={item} onClick={handleItemClick} />
                ))
              ) : (
                <EmptyState message="아직 거래한게 없어요" />
              )}
            </div>
          </section>
        )}
      </main>
      </div>
    </>
  );
}
