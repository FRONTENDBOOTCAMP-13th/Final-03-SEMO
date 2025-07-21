"use client";

import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/userStore";
import Input from "../_components/Input";
import Button from "../_components/Button";
import BackButton from "../_components/BackButton";

export default function SignupForm() {
  const router = useRouter();
  const { email, setEmail } = useUserStore();

  const handleEmailSubmit = () => {
    const isValidEmail = email.includes("@") && email.endsWith(".ac.kr");

    if (!isValidEmail) {
      alert("올바른 학교 이메일(@...ac.kr) 형식이 아닙니다.");
      return;
    }

    router.push("/signup/password");
  };

  return (
    <main className="bg-white min-h-screen flex justify-center">
      <div className="min-w-[320px] w-full max-w-[480px] px-6 flex flex-col items-center justify-center flex-grow">
        <div className="w-full mb-4">
          <BackButton />
        </div>

        {/* 텍스트 환영 문구 */}
        <div className="text-left w-full max-w-sm mb-10">
          <p className="font-semibold color-uni-black text-20">
            <span className="color-uni-blue-400 text-35">UniStuff</span> 에 오신걸
          </p>
          <p className="font-bold color-uni-black text-35">환영합니다!</p>
        </div>

        {/* 이메일 입력 영역 */}
        <div className="w-full max-w-sm space-y-16">
          <Input type="email" placeholder="학교 이메일" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Button type="primary" onClick={handleEmailSubmit}>
            이메일 입력
          </Button>
        </div>
      </div>
    </main>
  );
}
