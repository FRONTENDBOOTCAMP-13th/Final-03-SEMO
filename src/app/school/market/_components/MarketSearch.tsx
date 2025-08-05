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
    <section className="w-full min-w-[340px] max-w-[480px] mx-auto" role="search" aria-labelledby="search-title">
      <h2 id="search-title" className="sr-only">
        상품 검색
      </h2>
      <form onSubmit={handleSubmit} role="search" aria-label="상품 검색 폼">
        <fieldset className="search-fieldset">
          <legend className="sr-only">검색어 입력</legend>
          <div className="flex items-center bg-uni-gray-200 rounded-[12px] h-12 w-full">
            <button type="submit" className="text-uni-black cursor-pointer" aria-label="검색 버튼" title="검색하기">
              <SearchIcon size={24} className="ml-4 text-uni-gray-600" />
            </button>
            <label htmlFor="search-input" className="sr-only">
              검색어를 입력하세요
            </label>
            <input
              id="search-input"
              type="search"
              placeholder="검색"
              value={keyword}
              onChange={(e) => setkeyword(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full ml-2 my-3 bg-transparent outline-none placeholder-[#5E738C] text-16 text-uni-black"
              autoComplete="off"
              spellCheck="false"
            />
            <div id="search-help" className="sr-only">
              상품명이나 키워드를 입력하여 검색할 수 있습니다. enter 또는 검색 버튼을 눌러 검색하세요.
            </div>
          </div>
        </fieldset>
      </form>
      {/* 검색 상태 알림 (스크린 리더용) */}
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {keyword ? `입력된 검색어: ${keyword}` : "검색어를 입력해주세요"}
      </div>
    </section>
  );
};

export default Search;
