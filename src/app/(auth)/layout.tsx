import { ReactNode } from "react";
import "../globals.css";

interface MyPageLayoutProps {
  children: ReactNode;
  // modal?: ReactNode;
}

export default function RootLayout({ children /* modal*/ }: MyPageLayoutProps) {
  return (
    <div className="min-h-screen bg-white min-w-[320px] w-full max-w-[480px] mx-auto relative">
      {/* 메인 콘텐츠 */}
      <main className="pb-20">{children}</main>

      {/* 모달 (Intercepting Route로 구현예쩡) */}
      {/*modal*/}
    </div>
  );
}
