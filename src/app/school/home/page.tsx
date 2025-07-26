import MarketSearch from "../market/[marketType]/_components/MarketSearch";
import HeroSection from "./_components/HeroSection";
import HomeHeader from "./_components/HomeHeader";

export default function HomePage() {
  return (
    <div className="min-w-[320px] max-w-[480px] mx-auto px-4 py-3 bg-uni-white">
      <HomeHeader />
      <MarketSearch />
      <HeroSection />
    </div>
  );
}
