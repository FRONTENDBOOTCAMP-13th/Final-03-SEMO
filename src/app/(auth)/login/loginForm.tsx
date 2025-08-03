"use client";

import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import LogoLow from "../_components/LogoLow";
import BackButton from "../_components/BackButton";
import PasswordInput from "../_components/PasswordInput";
import { useUserStore } from "@/store/userStore";
import { login } from "@/lib/actions/login";
import { useAuthGuard } from "@/lib/useAuthGuard";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

// export default function LoginForm() {
function LoginFormContent() {
  useAuthGuard(false);
  const searchParams = useSearchParams();
  const resetUser = useUserStore((s) => s.resetUser);

  useEffect(() => {
    if (searchParams.get("from") === "signup") {
      // 회원가입 직후라면 이전에 임시로 들고 있던 회원가입용 정보 초기화
      resetUser();
    }
  }, [searchParams, resetUser]);
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
    router.push("/school/home");
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
            <button type="button" onClick={() => router.push("/find/id")} className="hover:underline">
              아이디 찾기
            </button>
            <button type="button" onClick={() => router.push("/signup")} className="hover:underline ">
              회원가입
            </button>
          </div>
          <div className="w-full max-w-sm mt-6">
            <Button buttonType="submit" type="primary">
              로그인
            </Button>
          </div>
        </form>

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

export default function LoginForm() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginFormContent />
    </Suspense>
  );
}
