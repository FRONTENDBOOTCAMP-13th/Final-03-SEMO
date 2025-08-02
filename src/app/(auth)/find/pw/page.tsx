"use client";

import { useState } from "react";
import { findPw } from "@/lib/actions/findPw";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import BackButton from "../../_components/BackButton";

export default function FindPwPage() {
  const [email, setEmail] = useState("");
  const [result, setResult] = useState("");

  const handleFindPw = async () => {
    const ok = await findPw(email);
    if (ok) {
      setResult("비밀번호 재설정 안내 메일을 전송했습니다. 메일함을 확인해주세요.");
    } else {
      setResult("메일 전송에 실패했습니다. 이메일 주소를 다시 확인해주세요.");
    }
  };

  return (
    <div className="relative min-h-screen px-4 pt-16 pb-10">
      <BackButton />
      <h1 className="text-lg font-semibold mb-6 text-center">비밀번호 찾기</h1>

      <div className="space-y-4">
        <Input type="email" placeholder="학교 이메일 입력" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Button onClick={handleFindPw}>비밀번호 전송</Button>
      </div>

      {result && <p className="mt-6 text-center text-sm text-uni-black whitespace-pre-wrap">{result}</p>}
    </div>
  );
}
