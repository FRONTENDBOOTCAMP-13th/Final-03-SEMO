"use client";

import { ReactNode, useMemo } from "react";
import { usePathname } from "next/navigation";
import "../globals.css";
import SignupBar from "./_components/SignupBar";

interface MyPageLayoutProps {
  children: ReactNode;
}

const stepFromPath = (pathname: string) => {
  if (pathname.startsWith("/signup/code")) return 4;
  if (pathname.startsWith("/signup/complete")) return 3;
  if (pathname.startsWith("/signup/password")) return 2;
  if (pathname.startsWith("/signup")) return 1;
  return 0;
};

export default function RootLayout({ children }: MyPageLayoutProps) {
  const pathname = usePathname();
  const currentStep = useMemo(() => stepFromPath(pathname), [pathname]);

  return (
    <div className="min-h-screen bg-white min-w-[320px] w-full max-w-[480px] mx-auto relative">
      {/* signup 플로우일 때만 progress bar */}
      {currentStep > 0 && (
        <div className="sticky top-0 z-10 bg-white">
          <SignupBar currentStep={currentStep} totalSteps={4} />
        </div>
      )}

      {/* main 콘텐츠: progress bar가 있을 땐 위쪽 여백 확보 */}
      <main className={currentStep > 0 ? "pt-2" : ""}>{children}</main>
    </div>
  );
}
