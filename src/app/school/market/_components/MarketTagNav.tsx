"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

const MARKET_TAGS = ["전체", "식품", "도서", "의류", "생활용품", "생활가전", "학용품", "기타"];
const STORAGE_KEY = "market_selected_tag";

export default function MarketTagNav() {
  const [activeTag, setActiveTag] = useState("전체");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // const marketType = pathname.includes("buy") ? "buy" : "sell" : "groupPurchase";
  let marketType = "";
  if (pathname.includes("groupPurchase")) {
    marketType = "groupPurchase";
  } else {
    marketType = pathname.includes("buy") ? "buy" : "sell";
  }

  useEffect(() => {
    // searchParams(쿼리파라미터)로 keyword 값 가져오기
    const keyword = searchParams.get("keyword");

    if (keyword && MARKET_TAGS.includes(keyword)) {
      // URL에 키워드가 있고 tags 배열에 포함되어 있으면 해당 tag 활성화
      setActiveTag(keyword);

      // 🐶 세션 스토리지에 태그 저장
      sessionStorage.setItem(STORAGE_KEY, keyword);
    } else {
      const savedTag = sessionStorage.getItem(STORAGE_KEY);
      if (savedTag && MARKET_TAGS.includes(savedTag)) {
        setActiveTag(savedTag);
      } else {
        // 일반 market이면 "전체" 활성화
        setActiveTag("전체");
      }
    }
  }, [searchParams]);
  // 의존성 배열에 추가하여 경로가 바뀔때마다 실행

  const handleTagClick = (tag: string) => {
    setActiveTag(tag);

    // [전체]가 아닌 경우에만 검색 페이지로 이동
    if (tag !== "전체") {
      router.push(`/school/market/${marketType}/search?keyword=${encodeURIComponent(tag.trim())}`);
    } else {
      sessionStorage.removeItem(STORAGE_KEY);
      // [전체]인 경우 메인 markey 페이지로 이동
      router.push(`/school/market/${marketType}`);
    }
  };

  return (
    <div className="w-full min-w-[340px] max-w-[480px] mx-auto pt-1 pb-5">
      <div className="flex gap-2 overflow-x-auto hide-scrollbar">
        {MARKET_TAGS.map((tag) => (
          <button
            key={tag}
            // value={activeTag}
            onClick={() => handleTagClick(tag)}
            className={`flex-shrink-0 px-5 py-2 rounded-full text-16 font-medium
              ${activeTag === tag ? "bg-uni-blue-400 text-uni-white" : "bg-uni-gray-200 text-uni-gray-300"}`}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
