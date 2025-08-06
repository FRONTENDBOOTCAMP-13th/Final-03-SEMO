"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/userStore";
import BackButton from "../../_components/BackButton";
import Logo from "../../_components/LogoLow";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { sendVerificationCode } from "@/lib/sendVerificationCode";
import { handleSignup } from "@/lib/actions/signup";

export default function SignupCodeClient() {
  const router = useRouter();
  const { user, verificationCode, setVerificationCode, emailForVerification, setEmailVerified, setUser } =
    useUserStore();

  const email = user.loginType === "kakao" ? emailForVerification : user.email || "";
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const sent = useRef(false);

  useEffect(() => {
    if (!email || sent.current) return;
    sent.current = true;

    const rnd = String(Math.floor(1000 + Math.random() * 9000));
    setVerificationCode(rnd);
    setLoading(true);

    sendVerificationCode(email, rnd).finally(() => setLoading(false));
  }, [email, setVerificationCode]);

  const handleVerify = async () => {
    if (loading) return;
    if (code !== verificationCode) {
      alert("번호가 일치하지 않습니다.");
      setCode("");
      return;
    }

    setEmailVerified(true);

    if (user.loginType === "kakao") {
      const token = localStorage.getItem("accessToken") || "";
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${user._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Client-Id": process.env.NEXT_PUBLIC_CLIENT_ID!,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...user, emailVerified: true }),
      });
      if (!res.ok) throw new Error("프로필 업데이트 실패");
      const data = await res.json();
      setUser(data.user || { ...user, emailVerified: true });
      router.replace("/school/home");
      return;
    }

    if (!user.email) {
      alert("이메일 정보가 없습니다. 다시 시도해주세요.");
      return;
    }

    try {
      setLoading(true);
      await handleSignup({ user, setLoading });
      alert("회원가입 완료!");
      router.push("/login?from=signup");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-white min-h-screen flex justify-center items-center">
      <div className="min-w-[320px] w-full max-w-[480px] px-6 flex flex-col items-center gap-8">
        <BackButton />
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
          <Button buttonType="submit" onClick={handleVerify} disabled={loading}>
            {loading ? "처리 중..." : "인증하기"}
          </Button>
        </div>
      </div>
    </main>
  );
}
