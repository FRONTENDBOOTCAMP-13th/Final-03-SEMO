"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUserStore } from "@/store/userStore";

const SKIP_PATHS = [
  "/login",
  "/find",
  "/signup",
  "/signup/code",
  "/signup/complete",
  "/onBoarding",
  "/school/myPage/kakaoSetting",
];
const BYPASS_PATHS = ["/school/myPage/kakaoSetting", "/signup/complete", "/signup/code", "/onBoarding"];

export function useRequireProfileCompletion() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, emailVerified } = useUserStore();

  useEffect(() => {
    // 0) 아직 user 정보 로딩 중이면 아무 처리하지 않음
    if (!user || !user.loginType) return;

    // 1) 이메일/비번 가입자는 프로필 보완 훅 자체를 건너뜀
    if (user.loginType !== "kakao") {
      return;
    }

    // 1) 스킵할 경로면 아무 처리도 하지 않음
    if (SKIP_PATHS.some((p) => pathname.startsWith(p))) {
      return;
    }

    // 2) extra 필드까지 펼쳐서 검사
    const uni = user.extra?.university;
    const stu = user.extra?.studentId;
    const dorm = user.address;
    const verified = user.emailVerified;
    const complete = !!uni && !!stu && !!dorm && verified;

    // 3) 바이패스 경로면 역시 리다이렉트 안 함
    if (BYPASS_PATHS.some((p) => pathname.startsWith(p))) {
      return;
    }

    // 4) 그 외엔 세팅 페이지로 밀어버림
    if (!complete) {
      router.replace("/school/myPage/kakaoSetting");
    }
  }, [pathname, user, emailVerified, router]);
}
