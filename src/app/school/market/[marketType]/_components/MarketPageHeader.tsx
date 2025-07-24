"use client";

import { useSetPageHeader } from "@/contexts/PageHeaderContext";
import { useCallback, useMemo } from "react";
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
  const pathname = usePathname(); // 현재 경로 가져오기

  // useCallback사용하여 함수 재생성 방지
  const handleMeatballClick = useCallback(() => {
    console.log("미트볼 스파게티");
    // 실제 메뉴 로직 구현
  }, []);

  const headerConfig = useMemo(() => {
    const pathSegments = pathname.split("/").filter(Boolean); // "/" 기준으로 경로 분리하고 빈 문자열 제거(맨 앞에)
    const marketIndex = pathSegments.indexOf("market"); // 배열에서 "market"의 인덱스 찾기
    const marketType = pathSegments[marketIndex + 1]; // buy or sell
    const subPage = pathSegments[marketIndex + 2]; // new or postId

    let config = HEADER_CONFIGS.list; // 기본값

    // 경로에 따른 설정 변경
    // subPage가 new면 등록 페이지로 세팅, 아니면 상세 페이지로 세팅
    if (subPage === "new") {
      config = HEADER_CONFIGS.new;
    } else if (subPage) {
      config = HEADER_CONFIGS.detail;
    }

    // backLink 동적 생성
    const backLink = subPage ? `/school/market/${marketType}` : config.backLink;

    return {
      title: config.title,
      backLink: backLink,
      type: config.showMeatball ? ("meatball" as const) : ("default" as const),
      ...(config.showMeatball && { onMeatballClick: handleMeatballClick }),
      // 스프레드 연산자 사용하여 showMeatball이 true일 때만 onMeatballClick 추가
    };
  }, [pathname, handleMeatballClick]);
  useSetPageHeader(headerConfig);

  return null;
}
