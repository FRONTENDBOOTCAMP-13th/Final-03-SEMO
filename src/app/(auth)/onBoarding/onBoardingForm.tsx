"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Logo from "../_components/Logo";
import { useAuthGuard } from "@/lib/useAuthGuard";

export default function OnBoardingClient() {
  useAuthGuard(false);
  const router = useRouter();

  return (
    <main className="bg-white min-h-screen flex justify-center">
      <div className="min-w-[320px] w-full max-w-[480px] px-6 py-8 flex flex-col">
        {/* 로고 + 버튼 */}
        <div className="flex flex-col items-center gap-6 flex-grow justify-center">
          <Logo />
          <div className="w-full flex flex-col gap-4 mt-2 max-w-xs">
            <Button type="primary" onClick={() => router.push("/login")}>
              로그인
            </Button>
            <Button type="outline" onClick={() => router.push("/signup")}>
              회원가입
            </Button>
          </div>
        </div>

        {/* 학교 리스트 하단 고정 */}
        <div className="mt-auto grid grid-cols-3 gap-2 text-xs text-center text-gray-500 opacity-70 pt-10">
          <span>성균관대</span>
          <span>중앙대</span>
          <span>한국외대</span>
          <span>서울과기대</span>
          <span>한국항공대</span>
          <span>연세대 미래캠</span>
        </div>
      </div>
    </main>
  );
}
