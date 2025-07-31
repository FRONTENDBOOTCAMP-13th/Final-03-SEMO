"use client";

import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import BackButton from "../../_components/BackButton";
import { useFindStore } from "@/store/findStore";
import { findId } from "@/lib/actions/findId";
import { useState } from "react";

export default function FindIdPage() {
  const { university, studentId, setUniversity, setStudentId } = useFindStore();
  const [result, setResult] = useState("");
  const router = useRouter();

  const handleFindId = async () => {
    const email = await findId(university, studentId);
    if (email) setResult(`가입된 이메일: ${email}`);
    else setResult("일치하는 정보가 없습니다.");
  };

  return (
    <div className="relative min-h-screen px-4 pt-16 pb-10 ">
      <BackButton />
      <h1 className="text-lg font-semibold mb-6 text-center">아이디(이메일) 찾기</h1>

      <div className="space-y-12">
        <Input placeholder="학교명" value={university} onChange={(e) => setUniversity(e.target.value)} />
        <Input placeholder="학번" value={studentId} onChange={(e) => setStudentId(e.target.value)} />
        <Button onClick={handleFindId} buttonType="button">
          아이디 찾기
        </Button>
        <Button type="outline" onClick={() => router.push("/find/password")}>
          비밀번호 찾기(비활성화)
        </Button>
      </div>

      {result && <p className="mt-6 text-center text-sm text-uni-black">{result}</p>}
    </div>
  );
}
