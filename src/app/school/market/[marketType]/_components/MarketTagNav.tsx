"use client";

import { useState } from "react";

export default function MarketTagNav() {
  const tags = ["전체", "의류", "음식", "전자제품", "도서", "기타"];
  const [activeTag, setActiveTag] = useState("전체");

  return (
    <div className="w-full min-w-[340px] max-w-[480px] mx-auto scrollbar-none pt-1 pb-5">
      <div className="flex gap-2 overflow-x-auto px-2">
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag)}
            className={`flex-shrink-0 px-6 py-2 rounded-full text-14 font-medium
              ${activeTag === tag ? "bg-uni-blue-400 text-uni-white" : "bg-uni-gray-200 text-uni-gray-300"}`}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
