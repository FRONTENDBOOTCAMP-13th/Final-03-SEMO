import { Metadata } from "next";
// import ItemSection from "./itemSection";
import ItemSection from "@/app/school/market/[marketType]/itemSection";
import FloatingButton from "@/components/common/FloatingButton";
import MarketPageHeader from "@/app/school/market/[marketType]/_components/MarketPageHeader";
import Search from "@/components/common/Search";
import Link from "next/link";
import { Post, ApiRes } from "@/types";

/**
 * 상품 목록 user flow
 * 1. 유저가 market 페이지 접속
 * -> 유저가 /school/market/sell or buy 로 이동
 * 2. 페이지가 로드되면, 해당 markeyType에 맞는 게시글 목록을 API에서 가져옴
 * 3. 서버가 응답한 게시글 목록 function/post.ts의 getPosts 함수
 * 가져온 게시글 데이터를 itemSection 컴포넌트에 전달하여 렌더링
 */

export const metadata: Metadata = {
  title: "UniStuff | Market",
  description: "Market 페이지입니다.",
};

export default async function MarketPage({ params }: { params: Promise<{ marketType: "buy" | "sell" }> }) {
  const { marketType } = await params;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts?type=${marketType}`, {
    headers: { "Client-Id": process.env.NEXT_PUBLIC_CLIENT_ID! },
    cache: "no-store", // 매번 최신 데이터 가져오기
  });

  if (!res.ok) throw new Error("게시글 로드 실패");
  const json = (await res.json()) as ApiRes<Post[]>;
  if (json.ok !== 1) throw new Error("게시글 로드 실패");
  return (
    <main className="px-5 py-1 bg-uni-white min-h-screen">
      <MarketPageHeader />
      <Search />
      <div className="flex justify-around mb-4 border-b border-uni-gray-300">
        {(["buy", "sell"] as const).map((i) => {
          // 읽기 전용 [buy, sell] 튜플 리터럴
          const label = i === "buy" ? "사고 싶어요" : "팔고 싶어요";
          const active = i === marketType;
          return (
            <Link
              key={i}
              href={`/school/market/${i}`}
              className={`flex-1 text-center py-2 font-bold text-14 ${
                active ? "text-uni-blue-400" : "text-uni-gray-500"
              }`}
            >
              {label}
              {active && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-47 h-[3px] bg-uni-blue-400" />}
            </Link>
          );
        })}
      </div>
      <ItemSection items={json.item} market={marketType} />
      <FloatingButton href={`/school/market/${marketType}/new`} />
    </main>
  );
}
