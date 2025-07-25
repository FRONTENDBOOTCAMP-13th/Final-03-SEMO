"use client";

import { useState, useMemo } from "react";
import TabNavigation from "../../_components/TabNavigation";
import ItemCard, { Item } from "../../_components/ItemCard";
import EmptyState from "../../_components/EmptyState";
import Pagination from "../../_components/Pagination";
import SectionHeader from "../../_components/SectionHeader";
import { useMyProducts } from "../../_hooks/useHistoryApi";
import { productsToMyPageItems } from "../../_utils/postConverter";
import { useResponsivePagination } from "../../_hooks/pagination/useResponsivePagination";

export default function MyPageMyPost() {
  const [activeTab, setActiveTab] = useState("전체");

  // API로부터 내가 판매한 상품 목록 가져오기
  const { products, isLoading, error, refetch } = useMyProducts();

  // API 데이터를 마이페이지 아이템 형식으로 변환
  const myPageItems = useMemo(() => {
    return productsToMyPageItems(products);
  }, [products]);

  // myPageItems에서 카테고리별로 필터링
  const sellItems: Item[] = myPageItems
    .filter((item) => item.category === "팔래요")
    .map((item) => ({
      id: item.id,
      title: item.title,
      price: item.price,
      image: item.image,
      status: item.status,
    }));

  const buyItems: Item[] = myPageItems
    .filter((item) => item.category === "살래요")
    .map((item) => ({
      id: item.id,
      title: item.title,
      price: item.price,
      image: item.image,
      status: item.status,
    }));

  const gatheringsItems: Item[] = myPageItems
    .filter((item) => item.category === "모여요")
    .map((item) => ({
      id: item.id,
      title: item.title,
      price: item.price,
      image: item.image,
      status: item.status,
    }));

  // 팔래요 페이지네이션
  const sellPagination = useResponsivePagination({
    data: sellItems,
    estimatedItemHeight: 88,
    minItemsPerPage: 3,
    maxItemsPerPage: 10,
    reservedHeight: 350, // 탭 네비게이션 + 하단 네비게이션을 고려하여 증가
  });

  // 살래요 페이지네이션
  const buyPagination = useResponsivePagination({
    data: buyItems,
    estimatedItemHeight: 88,
    minItemsPerPage: 3,
    maxItemsPerPage: 10,
    reservedHeight: 350, // 탭 네비게이션 + 하단 네비게이션을 고려하여 증가
  });

  // 모여요 페이지네이션
  const gatheringsPagination = useResponsivePagination({
    data: gatheringsItems,
    estimatedItemHeight: 88,
    minItemsPerPage: 3,
    maxItemsPerPage: 10,
    reservedHeight: 350, // 탭 네비게이션 + 하단 네비게이션을 고려하여 증가
  });

  const tabs = ["전체", "팔래요", "살래요", "모여요"];

  // 로딩 상태 처리
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

      <main className="p-4 space-y-6">
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
                <>
                  {activeTab === "팔래요"
                    ? // 팔래요 탭일 때만 페이지네이션 적용
                      sellPagination.paginatedData.map((item) => <ItemCard key={item.id} item={item} />)
                    : // 전체 탭일 때는 4개만 표시
                      sellItems.slice(0, 4).map((item) => <ItemCard key={item.id} item={item} />)}
                  {activeTab === "팔래요" && sellPagination.totalPages > 1 && (
                    <Pagination
                      pageCount={sellPagination.totalPages}
                      onPageChange={sellPagination.handlePageChange}
                      forcePage={sellPagination.currentPage - 1}
                    />
                  )}
                </>
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
                <>
                  {activeTab === "살래요"
                    ? // 살래요 탭일 때만 페이지네이션 적용
                      buyPagination.paginatedData.map((item) => <ItemCard key={item.id} item={item} />)
                    : // 전체 탭일 때는 4개만 표시
                      buyItems.slice(0, 4).map((item) => <ItemCard key={item.id} item={item} />)}
                  {activeTab === "살래요" && buyPagination.totalPages > 1 && (
                    <Pagination
                      pageCount={buyPagination.totalPages}
                      onPageChange={buyPagination.handlePageChange}
                      forcePage={buyPagination.currentPage - 1}
                    />
                  )}
                </>
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
              {gatheringsItems.length > 0 ? (
                <>
                  {activeTab === "모여요"
                    ? // 모여요 탭일 때만 페이지네이션 적용
                      gatheringsPagination.paginatedData.map((item) => <ItemCard key={item.id} item={item} />)
                    : // 전체 탭일 때는 4개만 표시
                      gatheringsItems.slice(0, 4).map((item) => <ItemCard key={item.id} item={item} />)}
                  {activeTab === "모여요" && gatheringsPagination.totalPages > 1 && (
                    <Pagination
                      pageCount={gatheringsPagination.totalPages}
                      onPageChange={gatheringsPagination.handlePageChange}
                      forcePage={gatheringsPagination.currentPage - 1}
                    />
                  )}
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
