"use client";

import Link from "next/link";
import { Post } from "@/types";
import ItemSection from "../../market/[marketType]/itemSection";
import { ChevronRight } from "lucide-react";

interface MarketPreviewProps {
  buyItems: Post[];
  sellItems: Post[];
  groupPurchaseItems: Post[];
}

export default function MarketPreview({ buyItems, sellItems, groupPurchaseItems }: MarketPreviewProps) {
  return (
    <main className="py-4 bg-uni-white" role="main" aria-labelledby="market-preview-title">
      <h1 id="market-preview-title" className="sr-only">
        마켓 미리보기
      </h1>
      <section className="mb-15" aria-label="buy-section-title">
        <header className="section-header">
          <Link href="/school/market/buy" className="flex items-center justify-between mb-4 group">
            <h2 className="text-20 font-semibold text-uni-black font-pretendard">사고싶어요</h2>
            <ChevronRight className="w-6 h-6 text-uni-gray-400mr-2" />
          </Link>
          <div id="buy-section-desc" className="sr-only">
            구매하고 싶은 상품들을 확인할 수 있습니다. 최대 4개의 상품이 미리보기로 표시됩니다.
          </div>
        </header>
        <div role="region" aria-label="사고싶어요 상품 목록">
          <ItemSection initialItems={buyItems.slice(0, 4)} market="buy" initialHasMore={false} />
        </div>
      </section>

      {/* 팔고 싶어요 세션 */}
      <section className="mb-15" aria-label="sell-section-title">
        <header className="section-header">
          <Link
            href="/school/market/sell"
            className="flex items-center justify-between mb-4 group"
            aria-describedby="sell-section-desc"
          >
            <h2 className="text-20 font-semibold text-uni-black font-pretendard">팔고싶어요</h2>
            <ChevronRight className="w-6 h-6 text-uni-gray-400mr-2" />
            <span className="sr-only">팔고싶어요 전체 보기</span>
          </Link>
          <div id="sell-section-desc" className="sr-only">
            판매 중인 상품들을 확인할 수 있습니다. 최대 4개의 상품이 미리보기로 표시됩니다.
          </div>
        </header>
        <div role="region" aria-label="팔고싶어요 상품 목록">
          <ItemSection initialItems={sellItems.slice(0, 4)} market="sell" initialHasMore={false} />
        </div>
      </section>
      {/* 공동구매 세션 */}
      <section className="mb-15" aria-label="group-section-title">
        <header className="section-header mb-4">
          <Link href="/school/market/groupPurchase" className="flex items-center justify-between mb-4 group">
            <h2 className="text-20 font-semibold text-uni-black font-pretendard">공동구매</h2>
            <ChevronRight className="w-6 h-6 text-uni-gray-400mr-2" />
          </Link>
          <div id="group-section-desc" className="sr-only">
            진행 중인 공동구매를 확인할 수 있습니다. 최대 2개의 공동구매가 미리보기로 표시됩니다.
          </div>
        </header>
        <div role="region" aria-label="공동구매 목록">
          <ItemSection initialItems={groupPurchaseItems.slice(0, 2)} market="groupPurchase" initialHasMore={false} />
        </div>
      </section>
      {/* 전체 설명 (스크린 리더용) */}
      <div className="sr-only">
        마켓 미리보기 영역입니다. 사고싶어요, 팔고싶어요, 공동구매 각 섹션의 최신 상품들을 확인할 수 있습니다. 각 섹션
        제목을 클릭하면 해당 카테고리의 전체 상품을 볼 수 있습니다.
      </div>
    </main>
  );
}
