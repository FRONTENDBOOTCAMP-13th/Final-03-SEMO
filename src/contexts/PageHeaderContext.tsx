/**
 * @fileoverview 페이지별 헤더 설정을 위한 Context API
 *
 * @description
 * 각 페이지에서 개별적으로 헤더를 설정할 수 있도록 하는 Context와 Hook을 제공합니다.
 * Layout 파일 수정 없이 각자의 페이지에서 헤더 정보를 설정할 수 있어 Git 충돌을 방지합니다.
 *
 * // 각자의 페이지 컴포넌트에서 사용
 * @example (미트볼 UI 사용 (메뉴 버튼 포함 헤더) )
 * import { useSetPageHeader } from "@/context/PageHeaderContext";
 * import { useCallback, useMemo } from "react";
 *
 * const handleMeatballClick = useCallback(() => {
 *    console.log("내 정보 메뉴 열기");
 *    // 실제 메뉴 로직 구현
 *  }, []);
 *
 *  const headerConfig = useMemo(
 *   () => ({
 *     title: "내 정보(테스트)",
 *      backLink: "/",
 *     type: "meatball" as const,
 *     onMeatballClick: handleMeatballClick,
 *   }),
 *   [handleMeatballClick]
 *  );
 *
 *  useSetPageHeader(headerConfig);
 * return <div>내 정보 콘텐츠…</div>;
 * @example ( 기본 UI 사용 (뒤로가기만 있는 헤더) )
 *
 *
 * import { useSetPageHeader } from "@/contexts/PageHeaderContext";
 *
 * export default function DetailPage() {
 *  useSetPageHeader({
 *    title: "상세 페이지",
 *    backLink: "/school/home",
 *     type: "default",
 * });
 *
 * return <div>상세 콘텐츠</div>;
 * }
 */

"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface HeaderConfig {
  title: string;
  backLink?: string;
  type?: "default" | "meatball";
  onMeatballClick?: () => void;
}

interface PageHeaderContextType {
  headerConfig: HeaderConfig | null;
  setHeaderConfig: (config: HeaderConfig | null) => void;
}

const PageHeaderContext = createContext<PageHeaderContextType | undefined>(undefined);

export function PageHeaderProvider({ children }: { children: ReactNode }) {
  const [headerConfig, setHeaderConfig] = useState<HeaderConfig | null>(null);

  return <PageHeaderContext.Provider value={{ headerConfig, setHeaderConfig }}>{children}</PageHeaderContext.Provider>;
}

export function usePageHeader() {
  const context = useContext(PageHeaderContext);
  if (context === undefined) {
    throw new Error("usePageHeader must be used within a PageHeaderProvider");
  }
  return context;
}

// 각 페이지에서 사용할 훅
export function useSetPageHeader(config: HeaderConfig) {
  const { setHeaderConfig } = usePageHeader();

  // 컴포넌트 마운트 시 헤더 설정, 언마운트 시 초기화
  useEffect(() => {
    setHeaderConfig(config);
    return () => setHeaderConfig(null);
  }, [config, setHeaderConfig]);
}
