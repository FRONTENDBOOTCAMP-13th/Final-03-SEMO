"use client";
import Link from "next/link";
import Image from "next/image";
import { Post } from "@/types";
import { MessageCircleMore } from "lucide-react";
import { getImageUrl } from "@/data/actions/file";

// interface Item {
//   _id: number;
//   title: string;
//   image: string | null;
// }
interface Props {
  items: Post[];
  market: "buy" | "sell" | "groupPurchase";
  _id?: number;
  layout?: "grid" | "list"; // 레이아웃 타입 설정
}

export default function ItemSection({ items, market }: Props) {
  if (!items || items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-15">
        <p className="text-15 text-gray-400 font-medium">해당 조건의 게시글이 없습니다.</p>
      </div>
    );
  }
  if (market === "groupPurchase") {
    return (
      <div className="space-y-9 min-w-[320px] max-w-[480px]">
        {items.map((item) => (
          <Link key={item._id} href={`/school/market/${market}/${item._id}`} className="block rounded-lg">
            {/* 이미지 */}
            <div className="flex gap-4">
              <Image
                src={getImageUrl(item.image)}
                alt={item.title}
                width={80}
                height={80}
                className="rounded-lg object-cover w-[130px] h-[130px]"
              />
              {/* 공동구매 카드 */}
              <div className="flex-1 max-w-[200px]">
                <span className="text-14 text-uni-gray-400">{item.tag}</span>
                <h3 className="text-16 font-bold mb-1 mt-2 truncate">{item.title}</h3>
                {/* 공동구매 정보 */}
                <div className="flex items-center gap-2">
                  <span className="text-14 text-uni-blue-400">모집인원 {item.extra.participants || 0}명</span>
                </div>
                {/* <p className="text-14 text-uni-gray-400 mb-2">예상금액 {Number(item.extra.price).toLocaleString()}원</p> */}
                <p className="text-14 bg-uni-gray-200 px-3 py-1 inline-block mt-5 rounded-full text-uni-gray-400">
                  {(() => {
                    const totalPrice = Number(item.extra.price);
                    const participants = item.extra.participants || 1;
                    const pricePerPerson = Math.floor(totalPrice / participants);
                    return `예상금액 ${pricePerPerson.toLocaleString()}원`;
                  })()}
                </p>
              </div>
            </div>
          </Link>
        ))}{" "}
      </div>
    );
  }
  // 리스트 레이아웃 (공동구매용)
  return (
    <div className="grid grid-cols-2 gap-4">
      {items.map((item) => (
        <Link key={item._id} href={`/school/market/${market}/${item._id}`} className="block rounded-lg">
          <Image
            src={getImageUrl(item.image)}
            alt={item.title}
            width={160}
            height={160}
            className="rounded-lg object-cover w-full h-[160px]"
          />
          <p className="mt-2 text-16 font-medium truncate">{item.title}</p>
          <div className="flex items-center justify-between text-14 text-uni-gray-400 mt-1">
            <p className="text-14 text-uni-gray-300 font-light truncate">
              {Number(item.extra.price).toLocaleString()}원
            </p>

            {/* 댓글 */}
            <div className="flex items-center">
              <MessageCircleMore size={15} color="gray" strokeWidth={2} />
              <span className="ml-1">{item.repliesCount || 0}</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
