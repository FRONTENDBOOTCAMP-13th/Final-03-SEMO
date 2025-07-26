"use client";

import { useSetPageHeader } from "@/contexts/PageHeaderContext";
import { useCallback, useMemo } from "react";
import { usePathname } from "next/navigation";

const HEADER_CONFIGS = {
  default: {
    title: "내 정보",
    backLink: "/school",
    showMeatball: false,
  },
  "my-post": {
    title: "거래 목록",
    backLink: "/school/myPage",
    showMeatball: false,
  },
  wishlist: {
    title: "찜한 목록",
    backLink: "/school/myPage",
    showMeatball: false,
  },
  "review-to-write": {
    title: "후기 작성",
    backLink: "/school/myPage",
    showMeatball: false,
  },
  account: {
    title: "계정 설정",
    backLink: "/school/myPage",
    showMeatball: false,
  },
  notifications: {
    title: "알림 설정",
    backLink: "/school/myPage",
    showMeatball: false,
  },
  "app-info": {
    title: "앱 정보",
    backLink: "/school/myPage",
    showMeatball: false,
  },
  logout: {
    title: "로그아웃",
    backLink: "/school/myPage",
    showMeatball: false,
  },
  "write-review": {
    title: "후기 남기기",
    backLink: "/school/myPage/review-to-write",
    showMeatball: false,
  },
};

type HeaderConfigKey = keyof typeof HEADER_CONFIGS;

export default function MyPageHeader() {
  const pathname = usePathname(); // 현재 경로 가져오기

  // useCallback사용하여 함수 재생성 방지
  const handleMeatballClick = useCallback(() => {
    console.log("미트볼 스파게티");
  }, []);

  const headerConfig = useMemo(() => {
    const pathSegments = pathname.split("/").filter(Boolean);
    const myPageIndex = pathSegments.indexOf("myPage");
    const pageKey = pathSegments[myPageIndex + 1];

    let subPage: HeaderConfigKey = "default";
    if (pageKey && Object.keys(HEADER_CONFIGS).includes(pageKey)) {
      subPage = pageKey as HeaderConfigKey;
    }

    const config = HEADER_CONFIGS[subPage];

    return {
      title: config.title,
      backLink: config.backLink,
      type: config.showMeatball ? ("meatball" as const) : ("default" as const),
      ...(config.showMeatball && { onMeatballClick: handleMeatballClick }),
    };
  }, [pathname, handleMeatballClick]);
  useSetPageHeader(headerConfig);

  return null;
}
