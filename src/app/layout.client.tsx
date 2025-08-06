"use client";

import { ReactNode, useEffect } from "react";
import { useUserStore } from "@/store/userStore";
import { usePathname } from "next/navigation";
import Header from "@/components/common/Header";
import Navigation from "@/components/common/Navigation";
import { PageHeaderProvider, usePageHeader } from "@/contexts/PageHeaderContext";
import { ToastContainer } from "react-toastify";
import GlobalSocketManager from "@/components/common/globalSocketManager";

interface LayoutContentProps {
  children: ReactNode;
}

const AUTH_PATHS = ["/login", "/signup", "/onBoarding"];

function LayoutContent({ children }: LayoutContentProps) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/" || AUTH_PATHS.some((path) => pathname.startsWith(path));
  const { headerConfig } = usePageHeader();

  const { resetUser } = useUserStore();

  useEffect(() => {
    const expiresAt = localStorage.getItem("user-expires-at");
    if (expiresAt && Date.now() > parseInt(expiresAt, 10)) {
      resetUser();
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user-expires-at");
      localStorage.removeItem("onboarding-completed");
    }
  }, [resetUser]);

  if (isAuthPage) {
    return <div className="min-h-screen bg-uni-white min-w-[320px] w-full max-w-[480px] mx-auto">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-uni-white min-w-[320px] w-full max-w-[480px] mx-auto relative">
      <GlobalSocketManager isAuthPage={isAuthPage} />

      {headerConfig && (
        <Header
          title={headerConfig.title}
          backLink={headerConfig.backLink}
          type={headerConfig.type}
          onMeatballClick={headerConfig.onMeatballClick}
        />
      )}

      <main className="pb-20">{children}</main>
      {/* 모달 자리 */}
      <Navigation />
    </div>
  );
}

export default function RootLayoutClient({ children }: LayoutContentProps) {
  return (
    <PageHeaderProvider>
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
  );
}
