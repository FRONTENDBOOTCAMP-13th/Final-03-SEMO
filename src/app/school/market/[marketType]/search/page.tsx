import ItemSection from "../itemSection";
import { getKeywordPosts } from "@/app/api/market/functions/post";
import MarketPageHeader from "../_components/MarketPageHeader";
import MarketSearch from "@/app/school/market/[marketType]/_components/MarketSearch";
import MarketTagNav from "../_components/MarketTagNav";
import Link from "next/link";

interface SearchPageProps {
  params: Promise<{ marketType: "buy" | "sell" }>;
  searchParams: Promise<{ keyword?: string }>;
}

export default async function SearchPage({ params, searchParams }: SearchPageProps) {
  const { marketType } = await params;
  const { keyword } = await searchParams;

  const res = await getKeywordPosts(marketType, keyword || null);

  return (
    <main className="px-5 py-1 bg-uni-white min-h-screen">
      <MarketPageHeader />
      <MarketSearch />
      <MarketTagNav />

      {/* 헤더 */}
      <div className="flex items-center mb-4">
        <Link href={`/school/market/${marketType}`} className="mr-4"></Link>
      </div>
      <ItemSection items={res.ok ? res.item : []} market={marketType} />
    </main>
  );
}
