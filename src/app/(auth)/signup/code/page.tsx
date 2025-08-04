"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/userStore";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import BackButton from "../../_components/BackButton";
import Logo from "../../_components/LogoLow";
import { handleSignup } from "@/lib/actions/signup";
import { sendVerificationCode } from "@/lib/sendVerificationCode";

export default function SignupCodePage() {
  const router = useRouter();
  const { user, verificationCode, setVerificationCode } = useUserStore();

  const email = user?.email || "";
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const mountedRef = useRef(false); // StrictMode 대비 한 번만 실행

  // 이메일 없으면 되돌리기 (새로고침 등으로 상태 날아갔을 때)
  useEffect(() => {
    if (!email) {
      alert("이메일 정보가 없습니다. 처음부터 다시 진행해주세요.");
      router.replace("/signup");
    }
  }, [email, router]);

  // 인증번호 생성 / 전송 (한 번만)
  useEffect(() => {
    if (!email) return; // 이메일 없으면 동작하지 않음
    if (mountedRef.current) return;
    mountedRef.current = true;

    const randomCode = Math.floor(1000 + Math.random() * 9000).toString();
    setVerificationCode(randomCode);
    setLoading(true);

    console.log("전송 이메일:", email, "생성된 인증번호:", randomCode);

    sendVerificationCode(email, randomCode)
      .then(() => {
        console.log("메일 전송 완료", randomCode);
      })
      .catch((err) => {
        alert(err.message || "메일 전송 실패");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [email, setVerificationCode]);

  const executedRef = useRef(false);

  const handleVerify = async () => {
    console.log("handleVerify 호출됨", {
      executedRef: executedRef.current,
      code,
      verificationCode,
      loading,
    });

    if (loading) return; // 중복 클릭 방지

    if (code !== verificationCode) {
      alert("인증번호가 일치하지 않습니다.");
      setCode(""); // 입력 초기화해서 사용자에게 재입력 유도
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
      router.push("/login?from=signup");
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
