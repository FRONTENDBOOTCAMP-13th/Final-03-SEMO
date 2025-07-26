"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/userStore";
import Input from "../../_components/Input";
import Button from "../../_components/Button";
import BackButton from "../../_components/BackButton";
import Logo from "../../_components/LogoLow";
import { sendVerificationCode } from "@/lib/sendVerificationCode";

export default function SignupCodePage() {
  const router = useRouter();
  const { user } = useUserStore();
  const email = user?.email || "";
  const [code, setCode] = useState("");
  const [serverCode, setServerCode] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const randomCode = Math.floor(1000 + Math.random() * 9000).toString();
    setServerCode(randomCode);

    setLoading(true);

    sendVerificationCode(email, randomCode)
      .then(() => console.log("메일 전송 완료"))
      .catch((err) => alert(err.message));
  }, [email]);

  const handleVerify = () => {
    if (code === serverCode) {
      alert("인증 성공!");
      router.push("/login");
    } else {
      alert("인증번호가 일치하지 않습니다.");
    }
  };

  return (
    <main className="bg-white min-h-screen flex justify-center items-center">
      <div className="min-w-[320px] w-full max-w-[480px] px-6 flex flex-col items-center gap-8">
        <div className="w-full">
          <BackButton />
        </div>

        <Logo />
        <p className="text-sm text-gray-600">입력한 이메일로 인증번호가 전송되었어요!</p>

        <div className="w-full max-w-sm flex flex-col gap-4">
          <Input
            type="text"
            placeholder="인증번호 4자리 입력"
            maxLength={4}
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <Button onClick={handleVerify} disabled={loading}>
            인증하기
          </Button>
        </div>
      </div>
    </main>
  );
}
