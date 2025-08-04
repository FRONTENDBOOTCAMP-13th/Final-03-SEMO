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

  useEffect(() => {
    // 브라우저 환경이 아니면 리턴 (SSR 방지)
    if (typeof window === "undefined") return;

    // setTimeout을 사용해 한 틱 뒤에 실행 (DOM과 상태가 안정화된 후)
    const timeoutId = setTimeout(() => {
      // 로그인 상태를 더 안정적으로 확인
      const userStoreToken = user.token?.accessToken;
      const localStorageToken = localStorage.getItem("accessToken");
      const isLoggedIn = !!(userStoreToken || localStorageToken);

      // 온보딩 완료 상태 확인
      const onboardingCompleted = localStorage.getItem("onboarding-completed") === "true";

      const isAuthPage =
        pathname.startsWith("/login") || pathname.startsWith("/signup") || pathname.startsWith("/find");
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
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [user.token?.accessToken, router, pathname]);

  return null;
}
