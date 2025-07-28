import MarketPageHeader from "@/app/school/market/_components/MarketPageHeader";
import MarketSearch from "@/app/school/market/_components/MarketSearch";

export default function groupPurchase() {
  return (
    <main className="relative min-w-[320px] max-w-[480px] px-5 py-1 bg-uni-white min-h-screen">
      <MarketPageHeader />
      <MarketSearch />
    </main>
  );
}
