"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUserStore } from "@/store/userStore";

export default function AuthRedirectHandler() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useUserStore();

  useEffect(() => {
    // 로그인 상태 확인: userStore의 user 객체에 accessToken이 있는지 확인
    const isLoggedIn = !!user.token?.accessToken;
    // 온보딩 완료 상태 확인: localStorage에서 직접 가져옴
    const onboardingCompleted =
      typeof window !== "undefined" && localStorage.getItem("onboarding_completed") === "true";

    const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/signup") || pathname.startsWith("/find");
    const isOnboardingPage = pathname === "/onBoarding";
    const isRootPage = pathname === "/";
    const isSchoolPage = pathname.startsWith("/school");

    if (isLoggedIn) {
      // 로그인된 사용자
      if (onboardingCompleted) {
        // 온보딩 완료: 루트, 온보딩, 인증 페이지에서 홈으로 리다이렉트
        if (isRootPage || isOnboardingPage || isAuthPage) {
          router.replace("/school/home");
        }
      } else {
        // 온보딩 미완료: 루트, 인증 페이지에서 온보딩으로 리다이렉트
        if (isRootPage || isAuthPage) {
          router.replace("/onBoarding");
        }
      }
    } else {
      // 로그인되지 않은 사용자: 온보딩, 스쿨 페이지 접근 시 루트로 리다이렉트
      if (isOnboardingPage || isSchoolPage) {
        router.replace("/");
      }
    }
  }, [user.token?.accessToken, router, pathname]); // user.token?.accessToken을 의존성 배열에 추가

  return null;
}
