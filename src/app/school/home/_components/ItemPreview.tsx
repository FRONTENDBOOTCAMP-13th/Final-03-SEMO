"use client";

import Link from "next/link";
import { Post } from "@/types";
import ItemSection from "../../market/[marketType]/itemSection";
import { ChevronRight } from "lucide-react";

interface MarketPreviewProps {
  buyItems: Post[];
  sellItems: Post[];
}

export default function MarketPreview({ buyItems, sellItems }: MarketPreviewProps) {
  return (
    <div className="py-4 bg-uni-white">
      <section className="mb-15">
        <Link href="/school/market/buy" className="flex items-center justify-between mb-4 group">
          <h2 className="text-20 font-semibold text-uni-black font-pretendard">사고싶어요</h2>
          <ChevronRight className="w-6 h-6 text-uni-gray-400mr-2" />
        </Link>

        <ItemSection initialItems={buyItems.slice(0, 4)} market="buy" initialHasMore={false} />
      </section>
      <section className="mb-15">
        <Link href="/school/market/sell" className="flex items-center justify-between mb-4 group">
          <h2 className="text-20 font-semibold text-uni-black font-pretendard">팔고싶어요</h2>
          <ChevronRight className="w-6 h-6 text-uni-gray-400mr-2" />
        </Link>

        <ItemSection initialItems={sellItems.slice(0, 4)} market="sell" initialHasMore={false} />
      </section>
      <section className="mb-15">
        <Link href="/school/market/sell" className="flex items-center justify-between mb-4 group">
          <h2 className="text-20 font-semibold text-uni-black font-pretendard">공동구매</h2>
          <ChevronRight className="w-6 h-6 text-uni-gray-400mr-2" />
        </Link>

        <ItemSection initialItems={sellItems.slice(0, 2)} market="groupPurchase" initialHasMore={false} />
      </section>
    </div>
  );
}
