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
          <h2 className="text-22 font-bold text-uni-gray-900">사고싶어요</h2>
          <ChevronRight size={30} className="text-uni-black" />
        </Link>

        <ItemSection items={buyItems.slice(0, 4)} market="buy" />
      </section>
      <section className="mb-15">
        <Link href="/school/market/sell" className="flex items-center justify-between mb-4 group">
          <h2 className="text-22 font-bold text-gray-900">팔고싶어요</h2>
          <ChevronRight size={30} className="text-uni-black" />
        </Link>

        <ItemSection items={sellItems.slice(0, 4)} market="sell" />
      </section>
    </div>
  );
}
