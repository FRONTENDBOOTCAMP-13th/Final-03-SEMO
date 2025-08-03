import ItemSection from "../itemSection";
import { getKeywordPosts } from "@/app/api/market/functions/post";
import MarketPageHeader from "../../_components/MarketPageHeader";
import MarketSearch from "@/app/school/market/_components/MarketSearch";
import MarketTagNav from "../../_components/MarketTagNav";
import Link from "next/link";

interface SearchPageProps {
  params: Promise<{ marketType: "buy" | "sell" | "groupPurchase" }>;
  searchParams: Promise<{ keyword?: string }>;
}

export default async function SearchPage({ params, searchParams }: SearchPageProps) {
  const { marketType } = await params;
  const { keyword } = await searchParams;

  const res = await getKeywordPosts(marketType, keyword || null, 1, 8);

  return (
    <main className="px-5 bg-uni-white min-h-screen">
      <MarketPageHeader />
      <MarketSearch />
      <div className="flex relative justify-around -mx-5">
        {marketType !== "groupPurchase" &&
          (["buy", "sell"] as const).map((i) => {
            // 읽기 전용 [buy, sell] 튜플 리터럴
            const label = i === "buy" ? "사고 싶어요" : "팔고 싶어요";
            const active = i === marketType;
            return (
              <Link
                key={i}
                href={`/school/market/${i}`}
                className={`flex-1 relative text-center py-3 font-bold text-14 ${
                  active ? "text-uni-blue-400" : "text-uni-gray-500"
                }`}
              >
                {label}
                {active && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-uni-blue-400" />}
              </Link>
            );
          })}
      </div>
      <MarketTagNav />

      {/* 헤더 */}
      <div className="flex items-center">
        <Link href={`/school/market/${marketType}`} className="mr-4"></Link>
      </div>
      <ItemSection
        initialItems={res.ok ? res.item : []}
        market={marketType}
        initialHasMore={res.ok ? res.item.length >= 8 : false}
      />
    </main>
  );
}
