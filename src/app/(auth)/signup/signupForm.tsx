"use client";

import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/userStore";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import BackButton from "../_components/BackButton";
import { checkEmailDuplicate } from "@/lib/actions/checkDuplicate";
import { useAuthGuard } from "@/lib/useAuthGuard";

export default function SignupForm() {
  useAuthGuard(false);
  const router = useRouter();
  const { user, setUser } = useUserStore();
  const email = user.email ?? "";

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, email: e.target.value });
  };

  const handleEmailSubmit = async () => {
    const isValidEmail = email.includes("@") && email.endsWith(".ac.kr");

    if (!isValidEmail) {
      alert("올바른 학교 이메일(@...ac.kr) 형식이 아닙니다.");
      return;
    }

    const { ok, message } = await checkEmailDuplicate(email);
    if (!ok) {
      alert(message);
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
          <p className="font-semibold text-uni-black text-20">
            <span className="text-uni-blue-400 text-35">UniStuff</span> 에 오신걸
          </p>
          <p className="font-bold text-uni-black text-35">환영합니다!</p>
        </div>

        {/* 이메일 입력 영역 */}
        <form
          className="w-full max-w-sm space-y-16"
          onSubmit={(e) => {
            e.preventDefault();
            handleEmailSubmit();
          }}
        >
          <Input type="email" placeholder="학교 이메일" value={email} onChange={handleEmailChange} />

          <Button buttonType="submit" type="primary">
            이메일 입력
          </Button>
        </form>
      </div>
    </main>
  );
}
