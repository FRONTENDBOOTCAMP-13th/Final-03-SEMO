import MarketPageHeader from "@/app/school/market/_components/MarketPageHeader";
import MarketSearch from "@/app/school/market/_components/MarketSearch";
import FloatingButton from "@/components/common/FloatingButton";
import ItemSection from "../[marketType]/itemSection";
import { getPosts } from "@/app/api/market/functions/post";
import MarketTagNav from "@/app/school/market/_components/MarketTagNav";
import { Pencil } from "lucide-react";

export default async function groupPurchase() {
  const boardType = "groupPurchase";
  const res = await getPosts(boardType, 1, 8);
  if (!res.ok) throw new Error("게시글 로드 실패");
  return (
    <main className="relative min-w-[320px] max-w-[480px] px-5 py-1 bg-uni-white min-h-screen">
      <MarketPageHeader />
      <MarketSearch />
      <MarketTagNav />
      <ItemSection
        initialItems={res.ok ? res.item || [] : []}
        market="groupPurchase"
        layout="list"
        initialHasMore={res.ok ? res.item.length >= 5 : false}
      />
      <FloatingButton
        href={`/school/market/groupPurchase/new`}
        icon={<Pencil size={25} color="white" />}
        text={"글쓰기"}
      />
    </main>
  );
}
