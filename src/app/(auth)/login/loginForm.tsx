"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Input from "../_components/Input";
import Button from "../_components/Button";
import LogoLow from "../_components/LogoLow";
import BackButton from "../_components/BackButton";
import PasswordInput from "../_components/PasswordInput";
import { useUserStore } from "@/store/userStore";
import { login } from "@/lib/actions/login";
// import { useAuthGuard } from "@/lib/useAuthGuard";

export default function LoginForm() {
  // useAuthGuard(false);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useUserStore();

  const handleLogin = async () => {
    const result = await login(email, password);

    if (!result.ok) {
      alert(`로그인 실패: ${result.message}`);
      return;
    }

    if (result.token) {
      localStorage.setItem("accessToken", result.token);
    }

    if (result.user) {
      setUser(result.user);
    }

    alert("로그인 성공!");
    router.push("/school");
  };

  const handleKakaoLogin = () => {
    const REST_API_KEY = process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY;
    const REDIRECT_URI = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI;

    if (!REST_API_KEY || !REDIRECT_URI) {
      alert("카카오 설정이 누락되었습니다.");
      return;
    }

    const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}`;

    window.location.href = KAKAO_AUTH_URL;
  };

  return (
    <main className="flex justify-center items-center min-h-screen bg-white">
      <div className="min-w-[320px] w-full max-w-[480px] px-6 py-12 flex flex-col items-center">
        <div className="w-full mb-4">
          <BackButton />
        </div>

        <div className="mb-10">
          <LogoLow />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
          className="w-full max-w-sm space-y-4 gap-2"
        >
          <Input type="email" placeholder="ID (학교 이메일)" value={email} onChange={(e) => setEmail(e.target.value)} />
          <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} placeholder="PW" />

          <div
            className="flex justify-between font-bold w-full mt-2"
            style={{
              fontSize: "var(--text-14)",
              color: "var(--color-uni-gray-400)",
            }}
          >
            <button type="submit" onClick={() => router.push("")} className="hover:underline">
              아이디 / 비밀번호 찾기
            </button>
            <button type="submit" onClick={() => router.push("/signup")} className="hover:underline ">
              회원가입
            </button>
          </div>
        </form>

        <div className="w-full max-w-sm mt-6">
          <Button type="primary" onClick={handleLogin}>
            로그인
          </Button>
        </div>

        <div className="w-full max-w-sm mt-10 space-y-3">
          <div className="flex items-center w-full max-w-sm gap-4 my-6">
            <div className="flex-grow h-px bg-gray-300" />
            <span className="text-sm text-gray-400 whitespace-nowrap">소셜 로그인</span>
            <div className="flex-grow h-px bg-gray-300" />
          </div>

          <Button type="kakao" onClick={handleKakaoLogin}>
            <Image src="/assets/kakao.svg" alt="Kakao" width={20} height={20} className="mr-2" />
            카카오 로그인
          </Button>

          <Button type="google" onClick={() => alert("구글 로그인")}>
            <Image src="/assets/google.svg" alt="Google" width={20} height={20} className="mr-2" />
            Google 로그인
          </Button>
        </div>
      </div>
    </main>
  );
}
