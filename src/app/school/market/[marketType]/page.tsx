// import ItemSection from '';
import ItemSection from "../itemSection";
import FloatingButton from "@/components/common/FloatingButton";
import Search from "@/components/common/Search";
import Link from "next/link";
// import { redirect } from 'next/navigation';

interface Item {
  id: number;
  title: string;
  img: string;
}

export default function MarketPage({ params }: { params: { marketType: "buy" | "sell" } }) {
  const { marketType } = params;

  // 더미 데이터
  const items: Item[] =
    marketType === "buy"
      ? [
          { id: 1, title: "치킨 깊티 구해요!", img: "/" },
          { id: 2, title: "컵라면 하나만요ㅠ", img: "/" },
          { id: 3, title: "치킨 깊티 구해요!", img: "/" },
          { id: 4, title: "컵라면 하나만요ㅠ", img: "/" },
          { id: 5, title: "치킨 깊티 구해요!", img: "/" },
          { id: 6, title: "컵라면 하나만요ㅠ", img: "/" },
        ]
      : [
          { id: 1, title: "치킨 깊티 구해요!", img: "/" },
          { id: 2, title: "컵라면 하나만요ㅠ", img: "/" },
          { id: 3, title: "치킨 깊티 구해요!", img: "/" },
          { id: 4, title: "컵라면 하나만요ㅠ", img: "/" },
          { id: 5, title: "치킨 깊티 구해요!", img: "/" },
          { id: 6, title: "컵라면 하나만요ㅠ", img: "/" },
        ];

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
      <ItemSection items={items} market={marketType} />
      <FloatingButton href={`/school/market/${marketType}/new`} />
    </main>
  );
}
