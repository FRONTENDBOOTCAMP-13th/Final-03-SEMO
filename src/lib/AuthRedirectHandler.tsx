"use client";

/**
 * @fileoverview AuthRedirectHandler 컴포넌트
 *
 * @description
 * 이 컴포넌트는 사용자의 인증 상태(로그인 여부, 온보딩 완료 여부)에 따라
 * 적절한 페이지로 리다이렉션을 처리하는 역할을 합니다.
 *
 * @현재_구현_및_한계점
 * - 이 컴포넌트는 `useUserStore`의 `user` 객체와 `localStorage`의 `onboarding-completed` 값을 기반으로 동작합니다.
 * - `user.token?.accessToken`의 존재 여부로 로그인 상태를 판단하며, `localStorage`에서 온보딩 완료 여부를 직접 확인합니다.
 * - **문제점**: Next.js의 클라이언트 측 하이드레이션(hydration) 과정과 Zustand `persist` 미들웨어의 비동기 특성으로 인해,
 *   초기 페이지 로드 시(특히 새로고침 시) `user` 객체나 `localStorage` 데이터가 완전히 로드되기 전에
 *   리다이렉션 로직이 실행될 수 있습니다. 이 경우, 실제 로그인 상태와 다르게 판단하여
 *   의도치 않은 페이지(예: 스플래시 화면)로 리다이렉션될 수 있으며, 새로고침 시에만 정상 동작하는 것처럼 보일 수 있습니다.
 *
 * @로그인_회원가입_담당자_참고_사항
 * 이 파일은 현재 앱의 전반적인 인증 및 온보딩 흐름을 제어합니다.
 * 다음 사항을 참고하여 필요시 관련 코드를 검토하고 수정해주세요:
 * 1. **온보딩 완료 처리**: 온보딩 완료 시 `localStorage.setItem("onboarding-completed", "true")`가
 *    정확한 시점에 호출되는지 확인해주세요.
 * 2. **리다이렉션 경로**: 이 컴포넌트의 `isAuthPage`, `isOnboardingPage`, `isRootPage`, `isSchoolPage` 변수와
 *    내부 `if/else` 로직은 현재 앱의 경로 구조를 반영하고 있습니다. (auth) 폴더 내에서 경로 변경 시 함께 검토바랍니다
 */

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUserStore } from "@/store/userStore";

export default function AuthRedirectHandler() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useUserStore();

  // 여기서 건너뛸 경로들을 정의합니다.
  const SKIP_PATHS = [
    "/signup",
    "/signup/code",
    "/signup/complete", // 필요에 따라 추가
    "/school/myPage/kakaoSetting", // 카카오 전용 프로필 보완 페이지
    "/onBoarding", // 온보딩 페이지
    "/login",
    "/find",
  ];

  useEffect(() => {
    // SSR 혹은 초기 hydration 중이면 동작 금지
    if (typeof window === "undefined") return;
    // 예외 경로면 바로 리턴 (어떤 redirect도 하지 않음)
    if (SKIP_PATHS.some((p) => pathname.startsWith(p))) return;

    const timeoutId = setTimeout(() => {
      const userStoreToken = user.token?.accessToken;
      const localStorageToken = localStorage.getItem("accessToken");
      const isLoggedIn = !!(userStoreToken || localStorageToken);
      const onboardingCompleted = localStorage.getItem("onboarding-completed") === "true";

      const isAuthPage =
        pathname.startsWith("/login") ||
        pathname.startsWith("/signup") ||
        pathname.startsWith("/find") ||
        pathname.startsWith("/signup/code") ||
        pathname.startsWith("/school/myPage/kakaoSetting");
      const isOnboardingPage = pathname === "/onBoarding";
      const isRootPage = pathname === "/";
      const isSchoolPage = pathname.startsWith("/school");

      if (isLoggedIn) {
        // 로그인된 사용자
        if (onboardingCompleted) {
          // 온보딩 완료 → 루트/인증 관련 페이지일 땐 홈으로
          if (isRootPage || isOnboardingPage || isAuthPage) {
            router.replace("/school/home");
          }
        } else {
          // 온보딩 미완료 → 루트/인증 관련 페이지일 땐 온보딩으로
          if (isRootPage || isAuthPage) {
            router.replace("/onBoarding");
          }
        }
      } else {
        // 비로그인 사용자
        if (isOnboardingPage || isSchoolPage) {
          router.replace("/");
        }
      }
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [user.token?.accessToken, pathname, router]);

  return null;
}
