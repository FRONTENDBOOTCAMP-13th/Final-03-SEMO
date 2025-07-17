// src/app/(auth)/signup/complete/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "../../_components/Input";
import Button from "../../_components/Button";
import BackButton from "../../_components/BackButton";
import Logo from "../../_components/LogoLow";

export default function SignupCompletePage() {
  const router = useRouter();
  const [university, setUniversity] = useState("");
  const [department, setDepartment] = useState("");
  const [studentId, setStudentId] = useState("");
  const [dormitory, setDormitory] = useState("");
  const [nickname, setNickname] = useState("");

  const handleSubmit = () => {
    if (!university || !department || !studentId || !nickname) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    // TODO: 백엔드로 회원가입 정보 제출

    router.push("/login"); // 회원가입 완료 후 로그인 페이지로 이동
  };

  return (
    <main className="bg-white min-h-screen flex justify-center items-center">
      <div className="min-w-[320px] w-full max-w-[480px] px-6 flex flex-col items-center gap-8">
        <div className="w-full">
          <BackButton />
        </div>

        <Logo />

        <div className="w-full max-w-sm flex flex-col gap-4">
          <select
            value={university}
            onChange={(e) => setUniversity(e.target.value)}
            className="w-full px-4 py-3 rounded border border-gray-300 bg-[var(--color-uni-gray-100)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-uni-blue-400)]"
          >
            <option value="">대학교 선택</option>
            <option value="서울대학교">서울대학교</option>
            <option value="연세대학교">연세대학교</option>
            <option value="고려대학교">고려대학교</option>
            {/* TODO: 학교 데이터 API 연동 가능 */}
          </select>

          <Input placeholder="소속 학과" value={department} onChange={(e) => setDepartment(e.target.value)} />
          <Input placeholder="소속 학번" value={studentId} onChange={(e) => setStudentId(e.target.value)} />
          <Input placeholder="기숙사 호관" value={dormitory} onChange={(e) => setDormitory(e.target.value)} />
          <Input placeholder="닉네임" value={nickname} onChange={(e) => setNickname(e.target.value)} />

          <Button onClick={handleSubmit}>회원가입</Button>
        </div>
      </div>
    </main>
  );
}
