import Image from "next/image";

/**
 * ItemCard 컴포넌트
 *
 * 거래 아이템(판매/구매/모임 등)을 카드 형태로 표시합니다.
 *
 * @example
 * <ItemCard
 *   id={1}
 *   title="인센스 사실분?"
 *   price="10,000원"
 *   image="🕯️"
 *   status="판매중"
 * />
 *
 * @param id - 아이템 고유 id
 * @param title - 아이템 제목
 * @param price - 가격 문자열
 * @param image - 아이콘 또는 이미지 (지금은 이모지 기반)
 * @param status - 판매중 or 판매완료
 */

// 아이템 공통 타입
export interface Item {
  id: number;
  title: string;
  price: string;
  image: string;
  status: "판매중" | "판매완료";
  marketType: "sell" | "buy" | "groupPurchase"; // marketType 속성 추가
}

export default function ItemCard({ item, onClick }: { item: Item; onClick?: (item: Item) => void }) {
  const getStatusButton = (status: Item["status"]) => {
    if (status === "판매중") {
      return (
        <span className="inline-block bg-uni-green-300 text-uni-white text-14 font-bold rounded-xl px-4 py-1.5">
          판매중
        </span>
      );
    } else {
      return (
        <button className="px-4 py-2 text-14 bg-uni-gray-300 text-uni-white rounded-lg font-medium font-pretendard ml-4">
          판매완료
        </button>
      );
    }
  };

  return (
    <div
      key={item.id}
      className="flex items-center justify-between p-4 bg-uni-white rounded-xl border border-uni-gray-100 cursor-pointer" // cursor-pointer 추가
      onClick={() => onClick && onClick(item)} // onClick 핸들러 추가
    >
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        <div className="relative w-12 h-12 bg-uni-gray-100 rounded-xl flex items-center justify-center text-20 flex-shrink-0 overflow-hidden">
          <Image src={item.image} alt={item.title} fill style={{ objectFit: "cover" }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="relative overflow-hidden">
            <h3 className="text-14 font-medium text-uni-black font-pretendard whitespace-nowrap">{item.title}</h3>
            <div className="absolute top-0 right-0 w-8 h-full bg-gradient-to-l from-uni-white to-transparent pointer-events-none"></div>
          </div>
          <p className="text-14 text-uni-gray-400 font-pretendard mt-0.5">{item.price}</p>
        </div>
      </div>
      {getStatusButton(item.status)}
    </div>
  );
}
