"use client";
import Link from "next/link";
import Image from "next/image";
import { Post } from "@/types";
import { MessageCircleMore, ChevronDown } from "lucide-react";
import { getPosts } from "@/app/api/market/functions/post";
import { getImageUrl } from "@/data/actions/file";
import { useState } from "react";

interface Props {
  initialItems: Post[];
  market: "buy" | "sell" | "groupPurchase";
  initialHasMore: boolean;
  _id?: number;
  layout?: "grid" | "list";
}

export default function ItemSection({ initialItems, market, initialHasMore }: Props) {
  const [items, setItems] = useState(initialItems); // 현재 보여주고 있는 게시글 목록
  const [page, setPage] = useState(1); // 현재 페이지
  const [hasMore, setHasMore] = useState(initialHasMore); // 더 볼 페이지가 있는지
  const [loading, setLoading] = useState(false); // 로딩 상태 추가

  if (!items || items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center mt-20">
        <p className="text-16 text-gray-400 font-medium">해당 조건의 게시글이 없습니다.</p>
      </div>
    );
  }

  const handleLoadMore = async () => {
    if (loading) return; // 중복 요청 방지

    setLoading(true);
    const nextPage = page + 1;
    // 버튼 클릭 -> 로딩중 -> Page + 1

    try {
      const res = await getPosts(market, nextPage, 6);
      // 서버에 다음 페이지 요청
      if (res.ok) {
        setItems((prev) => [...prev, ...res.item]);
        // 데이터 넘겨 받으면 기존 게시글 + 새로 받은 게시글 스프레드 연산자로 합쳐서 보여주기
        setPage(nextPage);
        // 받은 아이템이 10개 미만이면 더 이상 없다고 판단
        setHasMore(res.item.length >= 6);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("더 보기 로드 실패:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  // 공동구매 레이아웃
  if (market === "groupPurchase") {
    return (
      <div className="min-w-[320px] max-w-[480px]">
        <div className="space-y-5">
          {items.map((item) => (
            <Link key={item._id} href={`/school/market/${market}/${item._id}`} className="block rounded-lg">
              <div className="flex gap-4">
                <Image
                  src={getImageUrl(item.image)}
                  alt={item.title}
                  width={130}
                  height={130}
                  className="rounded-lg object-cover w-[130px] h-[130px]"
                  loading="eager"
                  priority={true}
                />
                <div className="flex-1 max-w-[200px]">
                  <span className="text-14 text-uni-gray-800">{item.tag}</span>
                  <h3 className="text-16 font-bold mb-1 mt-2 truncate">{item.title}</h3>

                  <div className="flex items-center gap-2">
                    <span className="text-14 text-uni-blue-400">모집인원 {item.extra.participants || 0}명</span>
                  </div>

                  <p className="text-14 bg-uni-gray-200 px-3 py-1 inline-block mt-5 rounded-full text-uni-gray-800">
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
          ))}
        </div>

        {hasMore && (
          // 게시글이 남아있으면 버튼 보여주기
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="w-full flex justify-center mt-8 py-3 bg-uni-gray-200 rounded-xl text-16 font-medium mb-20 cursor-pointer"
          >
            {loading ? "로딩 중" : "더 보기"}
            <ChevronDown />
          </button>
        )}
      </div>
    );
  }

  // 일반 상품 그리드 레이아웃
  return (
    <div>
      <div className="grid grid-cols-2 gap-4">
        {items.map((item, index) => (
          <Link key={item._id} href={`/school/market/${market}/${item._id}`} className="block rounded-lg">
            <div className="relative w-full aspect-square h-[160px] bg-uni-gray-100 rounded-lg overflow-hidden">
              <Image
                src={getImageUrl(item.image)}
                alt={item.title}
                width={160}
                height={160}
                className="rounded-lg object-cover w-full h-[160px]"
                // loading="eager"
                // priority={true}
                priority={index < 6}
                loading={index < 6 ? "eager" : "lazy"}
              />
            </div>
            <div className="mt-2 min-h-[60px]">
              {/* 고정 높이 */}
              <p className="mt-2 text-16 font-medium truncate">{item.title}</p>
              <div className="flex items-center justify-between text-14 text-uni-gray-400 mt-1">
                <p className="text-14 text-uni-gray-700 font-light truncate">
                  {Number(item.extra.price).toLocaleString()}원
                </p>
                <div className="flex items-center text-uni-gray-700">
                  <MessageCircleMore size={15} color="gray" strokeWidth={2} />
                  <span className="ml-1">{item.repliesCount || 0}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {hasMore && (
        <button
          onClick={handleLoadMore}
          disabled={loading}
          className="w-full flex justify-center mt-8 py-3 bg-uni-gray-200 rounded-xl text-16 font-medium mb-20"
        >
          {loading ? "로딩 중" : "더 보기"}
          <ChevronDown size={25} />
        </button>
      )}
    </div>
  );
}
