'use client';

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import TabNavigation from "@/components/ui/TabNavigation";
import ItemCard, { Item } from "@/app/school/myPage/_components/ItemCard";
import EmptyState from "@/components/common/EmptyState";
import Pagination from "@/components/ui/Pagination";
import SectionHeader from "@/components/common/SectionHeader";
import { useMyPosts } from "@/lib/hooks/useMyPosts";
import { postsToMyPageItems } from "@/lib/utils/postConverter";
import { useResponsivePagination } from "@/lib/hooks/pagination/useResponsivePagination";

export default function MyPostClient() {
  const [activeTab, setActiveTab] = useState("전체");
  const router = useRouter();

  const { sellPosts, buyPosts, groupPurchasePosts, isLoading, error, refetch } = useMyPosts();

  const handleItemClick = (item: Item) => {
    router.push(`/school/market/${item.marketType}/${item.id}`);
  };

  const myPageItems = useMemo(() => {
    const sellConverted = postsToMyPageItems(sellPosts, "sell");
    const buyConverted = postsToMyPageItems(buyPosts, "buy");
    const groupPurchaseConverted = postsToMyPageItems(groupPurchasePosts, "groupPurchase");
    return [...sellConverted, ...buyConverted, ...groupPurchaseConverted];
  }, [sellPosts, buyPosts, groupPurchasePosts]);

  const sellItems: Item[] = myPageItems.filter((item) => item.marketType === "sell");
  const buyItems: Item[] = myPageItems.filter((item) => item.marketType === "buy");
  const groupPurchaseItems: Item[] = myPageItems.filter((item) => item.marketType === "groupPurchase");

  const sellPagination = useResponsivePagination({ data: sellItems, estimatedItemHeight: 88, minItemsPerPage: 3, maxItemsPerPage: 10, reservedHeight: 350 });
  const buyPagination = useResponsivePagination({ data: buyItems, estimatedItemHeight: 88, minItemsPerPage: 3, maxItemsPerPage: 10, reservedHeight: 350 });
  const groupPurchasePagination = useResponsivePagination({ data: groupPurchaseItems, estimatedItemHeight: 88, minItemsPerPage: 3, maxItemsPerPage: 10, reservedHeight: 350 });

  const tabs = ["전체", "팔래요", "살래요", "모여요"];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-uni-white">
        <TabNavigation tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex items-center justify-center py-20">
          <div className="text-uni-gray-400 font-pretendard">상품 목록을 불러오는 중...</div>
        </div>
      </div>
    );
  }

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
      <TabNavigation tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="p-4 space-y-6">
        {(activeTab === "전체" || activeTab === "팔래요") && (
          <section>
            {activeTab === "전체" ? (
              <SectionHeader title="팔고싶어요" targetTab="팔래요" onTabChange={setActiveTab} />
            ) : (
              <h2 className="text-20 font-semibold mb-3 text-uni-black font-pretendard">팔고싶어요</h2>
            )}
            <div className="space-y-3">
              {sellItems.length > 0 ? (
                <>
                  {activeTab === "팔래요"
                    ? sellPagination.paginatedData.map((item) => <ItemCard key={item.id} item={item} onClick={handleItemClick} />)
                    : sellItems.slice(0, 4).map((item) => <ItemCard key={item.id} item={item} onClick={handleItemClick} />)}
                  {activeTab === "팔래요" && sellPagination.totalPages > 1 && <Pagination pageCount={sellPagination.totalPages} onPageChange={sellPagination.handlePageChange} forcePage={sellPagination.currentPage - 1} />}
                </>
              ) : (
                <EmptyState message="아직 거래한게 없어요" />
              )}
            </div>
          </section>
        )}
        {(activeTab === "전체" || activeTab === "살래요") && (
          <section>
            {activeTab === "전체" ? (
              <SectionHeader title="사고싶어요" targetTab="살래요" onTabChange={setActiveTab} />
            ) : (
              <h2 className="text-20 font-semibold mb-3 text-uni-black font-pretendard">사고싶어요</h2>
            )}
            <div className="space-y-3">
              {buyItems.length > 0 ? (
                <>
                  {activeTab === "살래요"
                    ? buyPagination.paginatedData.map((item) => <ItemCard key={item.id} item={item} onClick={handleItemClick} />)
                    : buyItems.slice(0, 4).map((item) => <ItemCard key={item.id} item={item} onClick={handleItemClick} />)}
                  {activeTab === "살래요" && buyPagination.totalPages > 1 && <Pagination pageCount={buyPagination.totalPages} onPageChange={buyPagination.handlePageChange} forcePage={buyPagination.currentPage - 1} />}
                </>
              ) : (
                <EmptyState message="아직 거래한게 없어요" />
              )}
            </div>
          </section>
        )}
        {(activeTab === "전체" || activeTab === "모여요") && (
          <section>
            {activeTab === "전체" ? (
              <SectionHeader title="모여요" targetTab="모여요" onTabChange={setActiveTab} />
            ) : (
              <h2 className="text-20 font-semibold mb-3 text-uni-black font-pretendard">모여요</h2>
            )}
            <div className="space-y-3">
              {groupPurchaseItems.length > 0 ? (
                <>
                  {activeTab === "모여요"
                    ? groupPurchasePagination.paginatedData.map((item) => <ItemCard key={item.id} item={item} onClick={handleItemClick} />)
                    : groupPurchaseItems.slice(0, 4).map((item) => <ItemCard key={item.id} item={item} onClick={handleItemClick} />)}
                  {activeTab === "모여요" && groupPurchasePagination.totalPages > 1 && <Pagination pageCount={groupPurchasePagination.totalPages} onPageChange={groupPurchasePagination.handlePageChange} forcePage={groupPurchasePagination.currentPage - 1} />}
                </>
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
