"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Home, ShoppingBag, Users, MessageSquare, User } from "lucide-react";
import "./globals.css";

interface MyPageLayoutProps {
  children: ReactNode;
  // modal?: ReactNode;
}

const AUTH_PATHS = ["/login", "/signup", "/onBoarding"];

export default function RootLayout({ children /*modal*/ }: MyPageLayoutProps) {
  const pathname = usePathname();
  const isAuthPage = AUTH_PATHS.some((path) => pathname.startsWith(path));

  return (
    <html lang="ko">
      <body>
        {isAuthPage ? (
          // ✅ 로그인/회원가입/온보딩 페이지는 헤더·네비 제거
          <div className="min-h-screen bg-white min-w-[320px] w-full max-w-[480px] mx-auto flex flex-col justify-center">
            {children}
          </div>
        ) : (
          // ✅ 나머지 일반 페이지는 공통 UI 포함
          <div className="min-h-screen bg-white min-w-[320px] w-full max-w-[480px] mx-auto relative">
            {/* 공통 헤더 */}
            <header className="bg-white border-b border-gray-200 px-3 py-2 sticky top-0 z-10">
              <div className="flex items-center h-11">
                <Link href="/" className="p-2 -ml-2 flex items-center justify-center">
                  <ChevronLeft className="w-6 h-6 text-gray-600" />
                </Link>
                <h1 className="absolute left-1/2 -translate-x-1/2 text-lg font-semibold text-black">내 정보</h1>
              </div>
            </header>

            {/* 메인 콘텐츠 */}
            <main className="pb-20">{children}</main>

            {/* 모달 (Intercepting Route 예정) */}
            {/*modal*/}

            {/* 하단 네비게이션 */}
            <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200 px-3 py-2 z-10">
              <div className="flex h-16">
                <Link href="/school/home" className="flex-1 flex flex-col items-center justify-center py-2 px-1">
                  <Home className="w-5 h-5 text-gray-400 mb-1" />
                  <div className="text-xs text-gray-400 font-medium">홈</div>
                </Link>
                <Link href="/school/market" className="flex-1 flex flex-col items-center justify-center py-2 px-1">
                  <ShoppingBag className="w-5 h-5 text-gray-400 mb-1" />
                  <div className="text-xs text-gray-400 font-medium">상품</div>
                </Link>
                <Link href="/school/getherings" className="flex-1 flex flex-col items-center justify-center py-2 px-1">
                  <Users className="w-5 h-5 text-gray-400 mb-1" />
                  <div className="text-xs text-gray-400 font-medium">공동구매</div>
                </Link>
                <Link href="/school/chat" className="flex-1 flex flex-col items-center justify-center py-2 px-1">
                  <MessageSquare className="w-5 h-5 text-gray-400 mb-1" />
                  <div className="text-xs text-gray-400 font-medium">채팅</div>
                </Link>
                <Link href="/school/myPage" className="flex-1 flex flex-col items-center justify-center py-2 px-1">
                  <User className="w-5 h-5 text-blue-400 mb-1" />
                  <div className="text-xs text-blue-400 font-semibold">내 정보</div>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </body>
    </html>
  );
}
