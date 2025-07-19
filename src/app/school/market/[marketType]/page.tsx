import { Metadata } from "next";
import ItemSection from "../itemSection";
import FloatingButton from "@/components/common/FloatingButton";
import Search from "@/components/common/Search";
import Link from "next/link";
import { Post, ApiRes } from "@/types";

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
