"use client";

import { useRouter } from "next/navigation";

export default function SplashScreenForm() {
  const router = useRouter();

  const handleSignUpClick = () => {
    router.push("/signup");
  };

  const handleLoginClick = () => {
    router.push("/login");
  };

  return (
    <div className="flex flex-col gap-3 w-full max-w-xs">
      <button
        onClick={handleSignUpClick}
        className="relative px-6 py-3 rounded-full bg-white liquid-glass text-black text-sm font-bold flex items-center justify-center transition duration-400 ease-[cubic-bezier(0.175,0.885,0.32,2.2)] animate-fade-in-delay-4"
      >
        <span className="relative z-20 font-semibold">회원가입</span>
      </button>

      <button
        onClick={handleLoginClick}
        className="relative px-6 py-3 rounded-full bg-white liquid-glass text-black text-sm font-bold flex items-center justify-center transition duration-400 ease-[cubic-bezier(0.175,0.885,0.32,2.2)] animate-fade-in-delay-4"
      >
        <span className="relative z-20 font-semibold">로그인</span>
      </button>
    </div>
  );
}
