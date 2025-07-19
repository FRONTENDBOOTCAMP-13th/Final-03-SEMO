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
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("이메일과 비밀번호를 모두 입력해주세요!");
      return;
    }

    try {
      const res = await fetch("https://fesp-api.koyeb.app/market/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "client-id": "openmarket",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await res.json();
      console.log("API 응답:", result);

      if (result.ok === 1 && result.item) {
        console.log("로그인 성공:", result.item);
        alert("로그인 성공!");
        router.push("/school");
      } else {
        alert("로그인 실패: " + (result.message ?? "알 수 없는 오류"));
      }
    } catch (err) {
      console.error("로그인 오류:", err);
      alert("로그인 실패: 알 수 없는 오류");
    }
  };

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
            <button type="button" onClick={() => router.push("")} className="hover:underline">
              아이디 / 비밀번호 찾기
            </button>
            <button type="button" onClick={() => router.push("/signup")} className="hover:underline">
              회원가입
            </button>
          </div>
        </div>

        {/* 로그인 버튼 */}
        <div className="w-full max-w-sm mt-6">
          <Button type="primary" onClick={handleLogin} disabled={!email || !password}>
            로그인
          </Button>
        </div>

        {/* 로그인 유지 */}
        <div className="w-full max-w-sm mt-4 flex items-center">
          <input
            id="rememberMe"
            type="checkbox"
            checked={rememberMe}
            onChange={() => setRememberMe(!rememberMe)}
            className="w-5 h-5 text-uni-blue-300 border border-uni-gray-200 rounded-4xl "
          />
          <label htmlFor="rememberMe" className="ml-2 text-sm text-uni-black">
            로그인 상태 유지
          </label>
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
