"use client";

import { useEffect } from "react";
import { logout } from "@/lib/actions/logout";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const doLogout = async () => {
      try {
        await logout(); // Zustand + fetch
        router.replace("/login");
      } catch {
        alert("로그아웃 실패!");
        router.replace("/school/myPage");
      }
    };

    doLogout();
  }, [router]);

  return <p className="text-16 text-uni-black font-pretendard text-center mt-20">로그아웃 중입니다...</p>;
}
