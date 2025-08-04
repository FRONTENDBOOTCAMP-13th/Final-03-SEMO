import { Metadata } from "next";
// import ItemSection from "./itemSection";
import ItemSection from "@/app/school/market/[marketType]/itemSection";
import FloatingButton from "@/components/common/FloatingButton";
import MarketPageHeader from "@/app/school/market/_components/MarketPageHeader";
// import Search from "@/components/common/Search";
import { getPosts } from "@/app/api/market/functions/post";
// 마켓검색 테스트
import MarketSearch from "@/app/school/market/_components/MarketSearch";
import MarketTagNav from "../_components/MarketTagNav";
import Link from "next/link";
import { Pencil } from "lucide-react";
// import { Post, ApiRes } from "@/types";

/**
 * 상품 목록 user flow
 * 1. 유저가 market 페이지 접속
 * -> 유저가 /school/market/sell or buy 로 이동
 * 2. 페이지가 로드되면, 해당 markeyType에 맞는 게시글 목록을 API에서 가져옴
 * 3. 서버가 응답한 게시글 목록 function/post.ts의 getPosts 함수
 * 가져온 게시글 데이터를 itemSection 컴포넌트에 전달하여 렌더링
 */

interface PageProps {
  params: Promise<{ marketType: "buy" | "sell" | "groupPurchase" }>;
}

export const metadata: Metadata = {
  title: "UniStuff | Market",
  description: "Market 페이지입니다.",
};

// export default async function MarketPage({ params }: { params: { marketType: "buy" | "sell" | "groupPurchase" } }) {
export default async function MarketPage({ params }: PageProps) {
  const { marketType } = await params;

  const res = await getPosts(marketType, 1, 8);

  if (!res.ok) throw new Error("게시글 로드 실패");
  return (
    <main className="relative min-w-[320px] max-w-[480px] px-5 bg-uni-white min-h-screen">
      <MarketPageHeader />
      <MarketSearch />
      <div className="flex relative justify-around -mx-5">
        {(["buy", "sell"] as const).map((i) => {
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
              {/* {active && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-uni-blue-400" />} */}
              <div
                className={`absolute bottom-0 left-0 right-0 ${
                  active ? "h-[2px] bg-uni-blue-400" : "h-[0.5px] bg-uni-gray-200"
                }`}
              />
            </Link>
          );
        })}
      </div>
      <MarketTagNav />
      <ItemSection initialItems={res.item} market={marketType} initialHasMore={res.item.length === 8} />
      <FloatingButton
        href={`/school/market/${marketType}/new`}
        icon={<Pencil size={25} color="white" />}
        text={"글쓰기"}
      />
    </main>
  );
}
