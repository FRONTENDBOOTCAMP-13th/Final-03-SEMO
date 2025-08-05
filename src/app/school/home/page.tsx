import MarketSearch from "../market/_components/MarketSearch";
import HeroSection from "./_components/HeroSection";
import HomeHeader from "./_components/HomeHeader";
import MarketPreview from "./_components/ItemPreview";
import FloatingButton from "@/components/common/FloatingButton";
import { getPosts } from "@/app/api/market/functions/post";
import { Pencil } from "lucide-react";
import { Suspense } from "react";

export default async function HomePage() {
  const [buyRes, sellRes, groupPurchaseRes] = await Promise.all([
    getPosts("buy"),
    getPosts("sell"),
    getPosts("groupPurchase"),
  ]);

  const buyItems = buyRes.ok ? buyRes.item : [];
  const sellItems = sellRes.ok ? sellRes.item : [];
  const groupPurchaseItems = groupPurchaseRes.ok ? groupPurchaseRes.item : [];
  return (
    // <div className="min-w-[320px] max-w-[480px] mx-auto px-4 py-3 bg-uni-white">
    //   <HomeHeader />
    //   <MarketSearch />
    //   <HeroSection />
    //   <MarketPreview buyItems={buyItems} sellItems={sellItems} />
    //   <FloatingButton href={`/school/market/sell/new`} icon={<Pencil size={25} color="white" />} text={"글쓰기"} />
    // </div>
    <div className="min-w-[320px] max-w-[480px] mx-auto px-4 py-3 bg-uni-white">
      <HomeHeader />
      <Suspense fallback={<div>검색창 로딩 중...</div>}>
        <MarketSearch />
      </Suspense>
      <HeroSection />
      <MarketPreview buyItems={buyItems} sellItems={sellItems} groupPurchaseItems={groupPurchaseItems} />
      <FloatingButton href={`/school/market/sell/new`} icon={<Pencil size={25} color="white" />} text={"글쓰기"} />
    </div>
  );
}
