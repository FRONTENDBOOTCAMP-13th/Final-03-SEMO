"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { SearchIcon } from "lucide-react";

const MARKET_TAGS = ["전체", "식품", "도서", "의류", "생활용품", "생활가전", "학용품", "기타"];

const Search = () => {
  const [keyword, setkeyword] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // // 현재 경로에서 marketType 추출 (buy 또는 sell)
  // const marketType = pathname.includes("/buy") ? "buy" : "sell";

  useEffect(() => {
    const urlKeyword = searchParams.get("keyword");
    if (urlKeyword && !MARKET_TAGS.includes(urlKeyword)) {
      setkeyword(urlKeyword);
    } else {
      setkeyword("");
    }
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!keyword.trim()) {
      alert("검색어를 입력해주세요!");
      return;
    }

    let searchPath = "";

    if (pathname.includes("/groupPurchase")) {
      searchPath = `/school/market/groupPurchase/search?keyword=${encodeURIComponent(keyword.trim())}`;
    } else if (pathname.includes("/market/")) {
      const marketType = pathname.includes("/buy") ? "buy" : "sell";
      searchPath = `/school/market/${marketType}/search?keyword=${encodeURIComponent(keyword.trim())}`;
    } else if (pathname.includes("/home")) {
      searchPath = `/school/market/buy/search?keyword=${encodeURIComponent(keyword.trim())}`;
    }
    // router.push(searchPath);
    window.location.href = searchPath;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit(e as any);
      router.refresh();
    }
  };

  return (
    <div className="w-full min-w-[340px] max-w-[480px] mx-auto">
      <form onSubmit={handleSubmit}>
        <div className="flex items-center bg-uni-gray-200 rounded-[12px] h-12 w-full">
          <button type="submit" className="text-uni-black cursor-pointer">
            <SearchIcon size={24} className="ml-4 text-uni-gray-600" />
          </button>
          <input
            type="search"
            placeholder="검색"
            value={keyword}
            onChange={(e) => setkeyword(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full ml-2 my-3 bg-transparent outline-none placeholder-[#5E738C] text-16 text-uni-black"
          />
        </div>
      </form>
    </div>
  );
};

export default Search;
