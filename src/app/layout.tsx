"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Header from "../../src/components/common/Header";
import Navigation from "../../src/components/common/Navigation";
import { PageHeaderProvider, usePageHeader } from "../../src/contexts/PageHeaderContext";
import "./globals.css";

interface MyPageLayoutProps {
  children: ReactNode;
  // modal?: ReactNode;
}

const AUTH_PATHS = ["/login", "/signup", "/onBoarding"];

function LayoutContent({ children }: MyPageLayoutProps) {
  const pathname = usePathname();
  const isAuthPage = AUTH_PATHS.some((path) => pathname.startsWith(path));
  const { headerConfig } = usePageHeader();

  if (isAuthPage) {
    return (
      //  로그인/회원가입/온보딩 페이지는 헤더·네비 제거

      <div className="min-h-screen bg-white min-w-[320px] w-full max-w-[480px] mx-auto flex flex-col justify-center">
        {children}
      </div>
    );
  }
  //  나머지 일반 페이지는 공통 UI 포함
  return (
    <div className="min-h-screen bg-white min-w-[320px] w-full max-w-[480px] mx-auto relative">
      {/* 헤더 컴포넌트 - 각 페이지에서 설정한 정보 사용 */}
      {headerConfig && (
        <Header
          title={headerConfig.title}
          backLink={headerConfig.backLink}
          type={headerConfig.type}
          onMeatballClick={headerConfig.onMeatballClick}
        />
      )}

      {/* 메인 콘텐츠 */}
      <main className="pb-20">{children}</main>

      {/* 모달 (Intercepting Route 예정) */}
      {/*modal*/}

      {/* 네비게이션 컴포넌트 */}
      <Navigation />
    </div>
  );
}

export default function RootLayout({ children /*modal*/ }: MyPageLayoutProps) {
  return (
    <html lang="ko">
      <body>
        <PageHeaderProvider>
          <LayoutContent>{children}</LayoutContent>
        </PageHeaderProvider>
      </body>
    </html>
  );
}
