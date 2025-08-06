"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import BackButton from "../../_components/BackButton";
import Logo from "../../_components/LogoLow";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useUserStore } from "@/store/userStore";
import { useAuthGuard } from "@/lib/useAuthGuard";

export default function SignupCompleteForm() {
  useAuthGuard(false);
  const router = useRouter();
  const { user, setUser } = useUserStore();
  const [loading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // 검증
    if (!user.extra?.university || !user.extra?.department || !user.extra?.studentId || !user.address || !user.name) {
      alert("모든 항목을 입력해 주세요!");
      return;
    }
    // 다음 단계로
    router.push("/signup/code");
  };

  // 아래 5개의 핸들러가 각각 올바른 위치에 저장합니다.
  const onUniversityChange = (v: string) =>
    setUser({
      ...user,
      extra: { ...user.extra, university: v },
    });
  const onDepartmentChange = (v: string) =>
    setUser({
      ...user,
      extra: { ...user.extra, department: v },
    });
  const onStudentIdChange = (v: string) =>
    setUser({
      ...user,
      extra: { ...user.extra, studentId: v },
    });
  const onDormitoryChange = (v: string) => setUser({ ...user, address: v });
  const onNameChange = (v: string) => setUser({ ...user, name: v });

  return (
    <main className="bg-white min-h-screen flex justify-center items-center">
      <div className="min-w-[320px] w-full max-w-[480px] px-6 flex flex-col items-center gap-6">
        <div className="w-full">
          <BackButton />
        </div>

        <Logo />

        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-2">
          {/* 학교 선택 */}
          <div className="relative w-full">
            <select
              value={user.extra?.university ?? ""}
              onChange={(e) => onUniversityChange(e.target.value)}
              className="appearance-none w-full pr-10 border border-uni-gray-200 rounded-lg p-4 text-16 focus:outline-uni-blue-400 focus:border-uni-blue-400 bg-uni-gray-100"
            >
              <option value="">대학교 선택</option>
              <option value="서울대학교">서울대학교</option>
              <option value="연세대학교">연세대학교</option>
              <option value="고려대학교">고려대학교</option>
              <option value="숭실대학교">숭실대학교</option>
              <option value="동국대학교">동국대학교</option>
              <option value="수원대학교">수원대학교</option>
              <option value="인하대학교">인하대학교</option>
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
              <Image src="/assets/select.svg" alt="드롭다운 화살표" width={10} height={10} />
            </div>
          </div>

          <Input
            placeholder="소속 학과"
            value={user.extra?.department ?? ""}
            onChange={(e) => onDepartmentChange(e.target.value)}
          />
          <Input
            placeholder="소속 학번(전체)"
            value={user.extra?.studentId ?? ""}
            onChange={(e) => onStudentIdChange(e.target.value)}
          />
          <Input
            placeholder="기숙사 호관"
            value={user.address ?? ""}
            onChange={(e) => onDormitoryChange(e.target.value)}
          />
          <Input placeholder="닉네임" value={user.name ?? ""} onChange={(e) => onNameChange(e.target.value)} />

          <Button buttonType="submit" disabled={loading} className="mt-6 w-full">
            {loading ? "가입 중..." : "회원가입"}
          </Button>
        </form>
      </div>
    </main>
  );
}
