"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Input from "../_components/Input";
import Button from "../_components/Button";
import LogoLow from "../_components/LogoLow";
import BackButton from "../_components/BackButton";
import PasswordInput from "../_components/PasswordInput";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <main className="flex justify-center items-center min-h-screen bg-white">
      <div className="min-w-[320px] w-full max-w-[480px] px-6 py-12 flex flex-col items-center">
        {/* BackButton 정적 상단 배치 */}
        <div className="w-full mb-4">
          <BackButton />
        </div>
        {/* UniStuff 로고 */}
        <div className="mb-10">
          <LogoLow />
        </div>

        {/* 입력 필드 */}
        <div className="w-full max-w-sm space-y-4 gap-2">
          <Input type="email" placeholder="ID (학교 이메일)" value={email} onChange={(e) => setEmail(e.target.value)} />
          <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} placeholder="PW" />
          <div
            className="flex justify-between font-bold w-full mt-2"
            style={{ fontSize: "var(--text-14)", color: "var(--color-uni-gray-400)" }}
          >
            {/* 왼쪽: 아이디 / 비밀번호 찾기 */}
            <button type="button" onClick={() => router.push("")} className="hover:underline">
              아이디 / 비밀번호 찾기
            </button>

            {/* 오른쪽: 회원가입 */}
            <button type="button" onClick={() => router.push("/signup")} className="hover:underline ">
              회원가입
            </button>
          </div>
        </div>

        {/* 로그인 버튼 */}
        <div className="w-full max-w-sm mt-6">
          <Button type="primary" onClick={() => router.push("/school")}>
            로그인
          </Button>
        </div>

        {/* 소셜 로그인 */}
        <div className="w-full max-w-sm mt-10 space-y-3">
          <div className="flex items-center w-full max-w-sm gap-4 my-6">
            <div className="flex-grow h-px bg-gray-300" />
            <span className="text-sm text-gray-400 whitespace-nowrap">소셜 로그인</span>
            <div className="flex-grow h-px bg-gray-300" />
          </div>

          {/* 카카오 */}
          <Button type="kakao" onClick={() => alert("카카오 로그인")}>
            <Image src="/assets/kakao.svg" alt="Kakao" width={20} height={20} className="mr-2" />
            카카오 로그인
          </Button>

          {/* 구글 */}
          <Button type="google" onClick={() => alert("구글 로그인")}>
            <Image src="/assets/google.svg" alt="Google" width={20} height={20} className="mr-2" />
            Google 로그인
          </Button>
        </div>
      </div>
    </main>
  );
}
