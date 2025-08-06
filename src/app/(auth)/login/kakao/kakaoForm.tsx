"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUserStore } from "@/store/userStore";

function KakaoLoginCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useUserStore();
  const calledRef = useRef(false);

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;

    const loginWithKakao = async () => {
      const code = searchParams.get("code");
      if (!code) {
        alert("인가 코드가 없습니다.");
        router.replace("/login");
        return;
      }

      // … 이하 기존 코드 그대로 …
    };

    loginWithKakao();
  }, [router, searchParams, setUser]);

  return <p className="text-center mt-20">카카오 로그인 중입니다...</p>;
}

import { Suspense } from "react";
export default function KakaoLoginClient() {
  return (
    <Suspense fallback={<p className="text-center mt-20">로딩 중...</p>}>
      <KakaoLoginCallback />
    </Suspense>
  );
}
