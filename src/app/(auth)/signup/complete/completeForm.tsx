"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import BackButton from "../../_components/BackButton";
import Logo from "../../_components/LogoLow";
import Button from "../../_components/Button";
import Input from "../../_components/Input";
import { useUserStore } from "@/store/userStore";
import { handleSignup } from "@/lib/actions/signup";
// import { useAuthGuard } from "@/lib/useAuthGuard";

export default function SignupCompleteForm() {
  // useAuthGuard(false);
  const router = useRouter();
  const { user, setUser } = useUserStore();
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof typeof user, value: string) => {
    setUser({ ...user, [field]: value });
  };

  return (
    <main className="bg-white min-h-screen flex justify-center items-center">
      <div className="min-w-[320px] w-full max-w-[480px] px-6 flex flex-col items-center gap-6">
        <div className="w-full">
          <BackButton />
        </div>

        <Logo />

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSignup({ user, setLoading, router });
          }}
          className="w-full max-w-sm space-y-2"
        >
          {/* 학교 선택 */}
          <div className="relative w-full">
            <select
              value={user.university ?? ""}
              onChange={(e) => handleChange("university", e.target.value)}
              className="appearance-none w-full px-4 py-3 pr-10 rounded border border-[var(--color-uni-gray-200)] bg-[var(--color-uni-gray-100)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-uni-blue-400)] focus:bg-white"
            >
              <option value="">대학교 선택</option>
              <option value="서울대학교">서울대학교</option>
              <option value="연세대학교">연세대학교</option>
              <option value="고려대학교">고려대학교</option>
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
              <Image src="/assets/select.svg" alt="드롭다운 화살표" width={10} height={10} />
            </div>
          </div>

          <Input
            placeholder="소속 학과"
            value={user.department ?? ""}
            onChange={(e) => setUser({ ...user, department: e.target.value })}
          />
          <Input
            placeholder="소속 학번"
            value={user.studentId ?? ""}
            onChange={(e) => setUser({ ...user, studentId: e.target.value })}
          />
          <Input
            placeholder="기숙사 호관"
            value={user.dormitory ?? ""}
            onChange={(e) => setUser({ ...user, dormitory: e.target.value })}
          />
          <Input
            placeholder="닉네임"
            value={user.name ?? ""}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
          />

          <Button buttonType="submit" disabled={loading} className="mt-6 w-full">
            {loading ? "가입 중..." : "회원가입"}
          </Button>
        </form>
      </div>
    </main>
  );
}
