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
    <div className="flex flex-col gap-3 w-full">
      <button
        onClick={handleSignUpClick}
        className="w-full py-3 rounded-lg font-pretendard font-semibold text-16 cursor-pointer flex justify-center items-center focus:outline-uni-blue-400 focus:border-uni-blue-400 bg-uni-blue-400 text-uni-white"
      >
        회원가입
      </button>

      <button
        onClick={handleLoginClick}
        className="w-full py-3 rounded-lg font-pretendard font-semibold text-16 cursor-pointer flex justify-center items-center focus:outline-uni-blue-400 focus:border-uni-blue-400 border border-uni-blue-400 text-uni-blue-400"
      >
        로그인
      </button>
    </div>
  );
}
