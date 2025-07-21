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
