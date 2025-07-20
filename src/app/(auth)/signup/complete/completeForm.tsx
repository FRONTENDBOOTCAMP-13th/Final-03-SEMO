"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import BackButton from "../../_components/BackButton";
import Logo from "../../_components/LogoLow";
import Button from "../../_components/Button";
import Input from "../../_components/Input";
import { useUserStore } from "@/store/userStore";

export default function SignupCompleteForm() {
  const router = useRouter();
  const {
    email,
    password,
    university,
    department,
    studentId,
    dormitory,
    nickname,
    setUniversity,
    setDepartment,
    setStudentId,
    setDormitory,
    setNickname,
  } = useUserStore();

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!university || !department || !studentId || !nickname) {
      alert("모든 항목을 입력해 주세요!");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "client-id": process.env.NEXT_PUBLIC_CLIENT_ID ?? "",
        },
        body: JSON.stringify({
          email,
          password,
          name: nickname,
          type: "user",
          address: dormitory,
          extra: {
            university,
            department,
            studentId,
          },
        }),
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();

      if (data.ok === 1) {
        alert("회원가입 완료!");
        router.push("/signup/code");
      } else {
        alert(`회원가입 실패: ${data.message}`);
      }
    } catch (err) {
      console.error("회원가입 에러:", err);
      alert("회원가입 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-white min-h-screen flex justify-center items-center">
      <div className="min-w-[320px] w-full max-w-[480px] px-6 flex flex-col items-center gap-6">
        <div className="w-full">
          <BackButton />
        </div>

        <Logo />

        <div className="w-full max-w-sm space-y-2">
          {/* 학교 선택 */}
          <div className="relative w-full">
            <select
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              className="appearance-none w-full px-4 py-3 pr-10 rounded border border-[var(--color-uni-gray-200)] bg-[var(--color-uni-gray-100)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-uni-blue-400)] focus:bg-white"
            >
              <option value="">대학교 선택</option>
              <option value="서울대학교">서울대학교</option>
              <option value="연세대학교">연세대학교</option>
              <option value="고려대학교">고려대학교</option>
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
              <Image src="/assets/select.svg" alt="드롭다운 화살표" width={10} height={10} />
            </div>
          </div>

          <Input placeholder="소속 학과" value={department} onChange={(e) => setDepartment(e.target.value)} />
          <Input placeholder="소속 학번" value={studentId} onChange={(e) => setStudentId(e.target.value)} />
          <Input placeholder="기숙사 호관" value={dormitory} onChange={(e) => setDormitory(e.target.value)} />
          <Input placeholder="닉네임" value={nickname} onChange={(e) => setNickname(e.target.value)} />
        </div>

        <Button onClick={handleSubmit} disabled={loading} className="mt-6 w-full max-w-sm">
          {loading ? "가입 중..." : "회원가입"}
        </Button>
      </div>
    </main>
  );
}
