"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { SearchIcon } from "lucide-react";

const Search = () => {
  const [keyword, setKeyword] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  // 현재 경로에서 marketType 추출 (buy 또는 sell)
  const marketType = pathname.includes("/buy") ? "buy" : "sell";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!keyword.trim()) {
      alert("검색어를 입력해주세요!");
      return;
    }

    // 검색 결과 페이지로 이동
    // encodeURIComponent : 한글, 특수문자, 공백 등 URL 형식으로 인코딩
    router.push(`/school/market/${marketType}/search?keyword=${encodeURIComponent(keyword.trim())}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit(e as any);
    }
  };

  return (
    <div className="w-full min-w-[340px] max-w-[480px] mx-auto py-3">
      <form onSubmit={handleSubmit}>
        <div className="flex items-center bg-uni-gray-200 rounded-[12px] h-12 w-full">
          <button type="submit" className="text-uni-black cursor-pointer">
            <SearchIcon size={24} className="ml-4 text-uni-gray-600" />
          </button>
          <input
            type="text"
            placeholder="검색"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full ml-2 my-3 bg-transparent outline-none placeholder-[#5E738C] text-16 text-uni-black"
          />
        </div>
      </form>
    </div>
  );
};

export default Search;
