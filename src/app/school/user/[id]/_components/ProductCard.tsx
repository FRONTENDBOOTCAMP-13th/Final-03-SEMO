import Image from "next/image";
import Link from "next/link";
import { MessageCircleMore } from "lucide-react";
import { getImageUrl } from "@/data/actions/file";

interface ProductCardProps {
  _id: number;
  title: string;
  image?: string | null;
  extra: {
    price: number;
    participants?: number;
  };
  repliesCount?: number;
  market: "sell" | "buy" | "groupPurchase";
  tag?: string;
  className?: string;
}

/**
 * ProductCard 컴포넌트 - itemSection의 디자인과 구조를 따르는 상품 카드
 */
export default function ProductCard({
  _id,
  title,
  image,
  extra,
  repliesCount = 0,
  market,
  tag,
  className = ""
}: ProductCardProps) {
  const href = `/school/market/${market}/${_id}`;

  // 공동구매 레이아웃
  if (market === "groupPurchase") {
    return (
      <Link key={_id} href={href} className={`block rounded-lg ${className}`}>
        <div className="flex gap-4">
          <Image
            src={getImageUrl(image || "")}
            alt={title}
            width={130}
            height={130}
            className="rounded-lg object-cover w-[130px] h-[130px]"
          />
          <div className="flex-1 max-w-[200px]">
            <span className="text-14 text-uni-gray-400">{tag}</span>
            <h3 className="text-16 font-bold mb-1 mt-2 truncate">{title}</h3>

            <div className="flex items-center gap-2">
              <span className="text-14 text-uni-blue-400">모집인원 {extra.participants || 0}명</span>
            </div>

            <p className="text-14 bg-uni-gray-200 px-3 py-1 inline-block mt-5 rounded-full text-uni-gray-400">
              {(() => {
                const totalPrice = Number(extra.price);
                const participants = extra.participants || 1;
                const pricePerPerson = Math.floor(totalPrice / participants);
                return `예상금액 ${pricePerPerson.toLocaleString()}원`;
              })()}
            </p>
          </div>
        </div>
      </Link>
    );
  }

  // 일반 상품 그리드 레이아웃 (sell, buy)
  return (
    <Link key={_id} href={href} className={`block rounded-lg ${className}`}>
      <Image
        src={getImageUrl(image || "")}
        alt={title}
        width={160}
        height={160}
        className="rounded-lg object-cover w-full h-[160px]"
      />
      <p className="mt-2 text-16 font-medium truncate">{title}</p>
      <div className="flex items-center justify-between text-14 text-uni-gray-400 mt-1">
        <p className="text-14 text-uni-gray-300 font-light truncate">
          {Number(extra.price).toLocaleString()}원
        </p>
        <div className="flex items-center">
          <MessageCircleMore size={15} color="gray" strokeWidth={2} />
          <span className="ml-1">{repliesCount}</span>
        </div>
      </div>
    </Link>
  );
}
