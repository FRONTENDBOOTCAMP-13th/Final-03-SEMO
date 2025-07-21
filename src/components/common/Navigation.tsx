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
    href: "/school/getherings",
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
    <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200 px-3 py-2 z-10">
      <div className="flex h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex-1 flex flex-col items-center justify-center py-2 px-1"
            >
              <Icon className={`w-5 h-5 mb-1 ${isActive ? "text-blue-400" : "text-gray-400"}`} />
              <div className={`text-xs font-medium ${isActive ? "text-blue-400 font-semibold" : "text-gray-400"}`}>
                {item.label}
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
