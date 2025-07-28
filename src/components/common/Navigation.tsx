/**
 * @fileoverview 하단 네비게이션 컴포넌트
 *
 * @description
 * 앱 하단에 고정되는 탭 네비게이션 UI입니다.
 * 현재 페이지 경로를 기반으로 활성 탭을 자동으로 표시하며,
 * 헤더 설정과 독립적으로 동작하여 색상 간섭이 없습니다.
 *
 * @features
 * - 5개 탭: 홈, 상품, 공동구매, 채팅, 내 정보
 * - 현재 경로 기반 활성 상태 자동 감지
 * - 활성 탭: 파란색, 비활성 탭: 회색
 *
 */

"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, ShoppingBag, Users, MessageSquare, User } from "lucide-react";

const navItems = [
  {
    href: "/school/home",
    icon: Home,
    label: "홈",
  },
  {
    href: "/school/market",
    icon: ShoppingBag,
    label: "상품",
  },
  {
    href: "/school/market/groupPurchase",
    icon: Users,
    label: "공동구매",
  },
  {
    href: "/school/chat",
    icon: MessageSquare,
    label: "채팅",
  },
  {
    href: "/school/myPage",
    icon: User,
    label: "내 정보",
  },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-uni-white border-t border-uni-gray-200 px-3 py-2 z-10">
      <div className="flex h-16">
        {navItems.map((item) => {
          const Icon = item.icon;

          let isActive = false;
          if (item.href === "/school/market") {
            isActive = pathname.startsWith("/school/market") && !pathname.startsWith("/school/market/groupPurchase");
          } else {
            // 정확히 일치하거나 하위 경로인 경우 활성화
            isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex-1 flex flex-col items-center justify-center py-2 px-1"
            >
              <Icon className={`w-5 h-5 mb-1 ${isActive ? "text-uni-blue-400" : "text-uni-gray-400"}`} />
              <div
                className={`text-12 font-medium font-pretendard ${isActive ? "text-uni-blue-400 font-semibold" : "text-uni-gray-400"}`}
              >
                {item.label}
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
