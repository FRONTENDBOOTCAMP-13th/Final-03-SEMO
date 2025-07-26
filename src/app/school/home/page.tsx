import MarketSearch from "../market/[marketType]/_components/MarketSearch";
import HeroSection from "./_components/HeroSection";
import HomeHeader from "./_components/HomeHeader";
import MarketPreview from "./_components/ItemPreview";
import FloatingButton from "@/components/common/FloatingButton";
import { getPosts } from "@/app/api/market/functions/post";

export default async function HomePage() {
  const [buyRes, sellRes] = await Promise.all([getPosts("buy"), getPosts("sell")]);

  const buyItems = buyRes.ok ? buyRes.item : [];
  const sellItems = sellRes.ok ? sellRes.item : [];
  return (
    <div className="min-w-[320px] max-w-[480px] mx-auto px-4 py-3 bg-uni-white">
      <HomeHeader />
      <MarketSearch />
      <HeroSection />
      <MarketPreview buyItems={buyItems} sellItems={sellItems} />
      <FloatingButton href={`/school/market/buy/new`} />
    </div>
  );
}
