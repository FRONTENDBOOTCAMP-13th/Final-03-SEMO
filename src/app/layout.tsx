/**
 * @fileoverview 앱 전체 레이아웃 컴포넌트
 *
 * @description
 * 앱의 최상위 레이아웃을 담당하며, 헤더와 네비게이션을 조합합니다.
 * Context API를 통해 각 페이지에서 설정한 헤더 정보를 받아 렌더링하고,
 * 인증 페이지에서는 헤더/네비게이션을 제외합니다.
 *
 * @features
 * - Context 기반 헤더 설정 (충돌 방지)
 * - 인증 페이지 예외 처리
 * - 헤더 중복 렌더링 방지
 * - 네비게이션 독립성 보장
 *
 * @important
 * 이 파일은 팀 공통 파일입니다.
 * 헤더 설정이 필요한 경우 각자의 페이지에서 useSetPageHeader 훅을 사용하세요.
 *
 */
"use client";

import { ReactNode } from "react";
import { useEffect } from "react";
import { useUserStore } from "@/store/userStore";
import { usePathname } from "next/navigation";
import Header from "../../src/components/common/Header";
import Navigation from "../../src/components/common/Navigation";
import { PageHeaderProvider, usePageHeader } from "../../src/contexts/PageHeaderContext";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import GlobalSocketManager from "@/components/common/globalSocketManager";
// import AuthRedirectHandler from "@/lib/AuthRedirectHandler";

interface MyPageLayoutProps {
  children: ReactNode;
  // modal?: ReactNode;
}

const AUTH_PATHS = ["/login", "/signup", "/onBoarding"];

function LayoutContent({ children }: MyPageLayoutProps) {
  //usePathname 기반 레이아웃 분기 로직 구현
  const pathname = usePathname();
  const isAuthPage = pathname === "/" || AUTH_PATHS.some((path) => pathname.startsWith(path));
  const { headerConfig } = usePageHeader();

  // 로그인 만료 시간 체크
  const { resetUser } = useUserStore();

  useEffect(() => {
    const expiresAt = localStorage.getItem("user-expires-at");
    if (expiresAt && Date.now() > parseInt(expiresAt, 10)) {
      console.log("로그인 만료됨 - 자동 로그아웃");
      resetUser();
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user-expires-at");
      localStorage.removeItem("onboarding-completed");
    }
  }, [resetUser]);

  if (isAuthPage) {
    return (
      //  로그인/회원가입/온보딩 페이지는 헤더·네비 제거

      <div className="min-h-screen bg-uni-white min-w-[320px] w-full max-w-[480px] mx-auto">{children}</div>
    );
  }
  //  나머지 일반 페이지는 공통 UI 포함
  return (
    <div className="min-h-screen bg-uni-white min-w-[320px] w-full max-w-[480px] mx-auto relative">
      {/* 로그인시 글로벌룸에 참여 */}
      <GlobalSocketManager isAuthPage={isAuthPage} />

      {/* 헤더 컴포넌트
      - 각 페이지에서 설정한 정보 사용 */}
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

// Layout 전체를 Context Provider로 감싸도록 구조 변경
export default function RootLayout({ children /*modal*/ }: MyPageLayoutProps) {
  return (
    <html lang="ko">
      <body>
        <PageHeaderProvider>
          {/* <AuthRedirectHandler /> */}
          <LayoutContent>{children}</LayoutContent>
          <ToastContainer
            position="top-center"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </PageHeaderProvider>
      </body>
    </html>
  );
}
