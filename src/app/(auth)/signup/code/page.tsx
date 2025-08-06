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

export default function SignupCodePage() {
  const router = useRouter();
  const { user, verificationCode, setVerificationCode, emailForVerification, setEmailVerified } = useUserStore();

  // 카카오 흐름이면 emailForVerification 사용, 일반 가입이면 user.email
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

    console.log("전송 이메일:", email, "생성된 인증번호:", rnd);

    sendVerificationCode(email, rnd)
      .then(() => {
        console.log("메일 전송 완료", rnd);
      })
      .catch((err) => {
        alert(err.message || "메일 전송 실패");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [email, setVerificationCode]);

  const handleVerify = async () => {
    if (loading) return;
    if (code !== verificationCode) {
      alert("번호가 일치하지 않습니다.");
      setCode("");
      return;
    }

    // ① 이메일 인증 플래그 true
    setEmailVerified(true);
    // (카카오 유저는 여기서 emailVerified=true 로 간주)
    // 다른 스토어 필드는 이미 kakaoSetting에서 setUser로 채워둠
    // 인증 후 바로 로그인 흐름으로 이어짐
    if (user.loginType === "kakao") {
      router.replace("/school/myPage/kakaoSetting?verified=1");
      return;
    }
    if (!user.email) {
      alert("이메일 정보가 없습니다. 다시 시도해주세요.");
      return;
    }

    try {
      setLoading(true);
      await handleSignup({ user, setLoading }); // 실제 회원가입 요청
      alert("회원가입 완료!");

      // 회원가입 성공 후 로그인 페이지로 이동하고 나서 상태 초기화
      router.replace("/onBoarding");
    } catch (err) {
      console.error("회원가입 처리 오류:", err);
      alert("회원가입 처리 중 오류 발생!");
    } finally {
      setLoading(false);
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
          <Button buttonType="submit" onClick={handleVerify} disabled={loading}>
            {loading ? "처리 중..." : "인증하기"}
          </Button>
        </div>
      </div>
    </main>
  );
}
