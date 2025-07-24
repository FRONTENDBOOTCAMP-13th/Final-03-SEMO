"use client";

import { useSetPageHeader } from "@/contexts/PageHeaderContext";
import { useCallback, useMemo, useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const HEADER_CONFIGS = {
  list: {
    title: "상품",
    backLink: "",
    showMeatball: false,
  },
  new: {
    title: "상품 등록",
    backLink: "", // backLink 추가 예정
    showMeatball: false,
  },
  detail: {
    title: "상품 상세",
    backLink: "", // backLink 추가 예정
    showMeatball: true,
  },
};

export default function MarketPageHeader() {
  const pathname = usePathname();
  const [showMenu, setShowMenu] = useState(false);

  // 메뉴가 열릴 때 스크롤 막기
  useEffect(() => {
    if (showMenu) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    // 스크롤 복원
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showMenu]);

  // 미트볼 클릭시 메뉴 토글
  const handleMeatballClick = useCallback(() => {
    setShowMenu(!showMenu); // 메뉴 토글 추가
  }, [showMenu]);

  const headerConfig = useMemo(() => {
    const pathSegments = pathname.split("/").filter(Boolean);
    const marketIndex = pathSegments.indexOf("market");
    const marketType = pathSegments[marketIndex + 1]; // buy or sell
    const subPage = pathSegments[marketIndex + 2]; // new or postId

    let config = HEADER_CONFIGS.list; // 기본값

    if (subPage === "new") {
      config = HEADER_CONFIGS.new;
    } else if (subPage) {
      config = HEADER_CONFIGS.detail;
    }

    const backLink = subPage ? `/school/market/${marketType}` : config.backLink;

    return {
      title: config.title,
      backLink: backLink,
      type: config.showMeatball ? ("meatball" as const) : ("default" as const),
      ...(config.showMeatball && { onMeatballClick: handleMeatballClick }),
    };
  }, [pathname, handleMeatballClick]);

  useSetPageHeader(headerConfig);

  // 메뉴 렌더링
  return showMenu ? (
    <div className="fixed inset-x-0 top-16 bg-uni-white rounded-b-lg shadow-lg border-b border-uni-gray-200 z-50 min-w-[320px] max-w-[480px] mx-auto px-4 py-3">
      <button
        onClick={() => setShowMenu(false)}
        className="w-full px-4 py-2 text-left text-uni-gray-400 hover:bg-uni-gray-100"
      >
        수정하기
      </button>
      <button
        onClick={() => setShowMenu(false)}
        className="w-full px-4 py-2 text-left text-uni-gray-400 hover:bg-uni-gray-100"
      >
        삭제하기
      </button>
      <button
        onClick={() => setShowMenu(false)}
        className="w-full px-4 py-2 text-left text-uni-gray-400 hover:bg-uni-gray-100"
      >
        공유하기
      </button>
    </div>
  ) : null;
}
