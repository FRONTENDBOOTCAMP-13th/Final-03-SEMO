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

      // 세션 스토리지에 태그 저장
      sessionStorage.setItem(STORAGE_KEY, keyword);
    } else {
      const savedTag = sessionStorage.getItem(STORAGE_KEY);
      if (savedTag && MARKET_TAGS.includes(savedTag)) {
        setActiveTag(savedTag);
        if (savedTag !== "전체") {
          router.replace(`/school/market/${marketType}/search?keyword=${encodeURIComponent(savedTag)}`);
        }
      } else {
        // 일반 market이면 "전체" 활성화
        setActiveTag("전체");
      }
    }
  }, [searchParams, marketType, router]);
  // 의존성 배열에 추가하여 경로가 바뀔때마다 실행

  const handleTagClick = (tag: string) => {
    setActiveTag(tag);

    if (tag !== "전체") {
      // 무조건 window.location.href로 이동 (새로고침 효과)
      window.location.href = `/school/market/${marketType}/search?keyword=${encodeURIComponent(tag.trim())}`;
    } else {
      sessionStorage.removeItem(STORAGE_KEY);
      window.location.href = `/school/market/${marketType}`;
    }
  };

  return (
    <div className="w-full min-w-[340px] max-w-[480px] mx-auto py-3">
      <div className="flex gap-2 overflow-x-auto hide-scrollbar">
        {MARKET_TAGS.map((tag) => (
          <button
            key={tag}
            // value={activeTag}
            onClick={() => handleTagClick(tag)}
            className={`flex-shrink-0 px-5 py-3 rounded-full text-16 font-medium
              ${activeTag === tag ? "bg-uni-blue-400 text-uni-white" : "bg-uni-gray-200 text-uni-gray-800"}`}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
