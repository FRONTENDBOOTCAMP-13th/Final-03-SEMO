"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BackButton from "../../_components/BackButton";
import Logo from "../../_components/LogoLow";
import Button from "../../_components/Button";
import Image from "next/image";
import Input from "../../_components/Input";

export default function SignupPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleNext = () => {
    if (password.length < 8 || !/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
      alert("비밀번호는 영문 + 숫자 조합으로 8자 이상이어야 합니다.");
      return;
    }

    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    router.push("/signup/complete");
  };

  return (
    <main className="bg-white min-h-screen flex justify-center items-center">
      <div className="min-w-[320px] w-full max-w-[480px] px-6 flex flex-col items-center gap-8">
        <div className="w-full">
          <BackButton />
        </div>

        <Logo />

        <div className="w-full max-w-sm flex flex-col gap-4">
          {/* 비밀번호 필드 - eye 토글 포함 */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="비밀번호(영문, 숫자 8자 이상)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-uni-gray-200 rounded-md px-4 py-3 text-sm focus:outline-uni-blue-400 focus:border-uni-blue-400 transition-colors "
              style={{ backgroundColor: "var(--color-uni-gray-100)" }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              <Image src="/assets/eye.svg" alt="비밀번호 보기" width={24} height={24} />
            </button>
          </div>

          {/* 비밀번호 확인 필드 */}
          <Input
            type="password"
            placeholder="비밀번호 확인"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <Button onClick={handleNext}>비밀번호 입력</Button>
        </div>
      </div>
    </main>
  );
}
