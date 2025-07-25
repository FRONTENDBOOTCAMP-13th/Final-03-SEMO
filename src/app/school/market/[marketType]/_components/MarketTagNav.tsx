"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function MarketTagNav() {
  const tags = ["전체", "식품", "도서", "의류", "생활용품", "생활가전", "학용품"];
  const [activeTag, setActiveTag] = useState("전체");
  const router = useRouter();
  const pathname = usePathname();

  const marketType = pathname.includes("buy") ? "buy" : "sell";

  const handleTagClick = (tag: string) => {
    setActiveTag(tag);

    // [전체]가 아닌 경우에만 검색 페이지로 이동
    if (tag !== "전체") {
      router.push(`/school/market/${marketType}/search?keyword=${encodeURIComponent(tag.trim())}`);
    } else {
      // [전체]인 경우 메인 markey 페이지로 이동
      router.push(`/school/market/${marketType}`);
    }
  };

  return (
    <div className="w-full min-w-[340px] max-w-[480px] mx-auto pt-1 pb-5">
      <div className="flex gap-2 overflow-x-auto hide-scrollbar">
        {tags.map((tag) => (
          <button
            key={tag}
            value={activeTag}
            onClick={() => handleTagClick(tag)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-14 font-medium
              ${activeTag === tag ? "bg-uni-blue-400 text-uni-white" : "bg-uni-gray-200 text-uni-gray-300"}`}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
