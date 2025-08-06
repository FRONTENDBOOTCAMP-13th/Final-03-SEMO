"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUserStore } from "@/store/userStore";
import BackButton from "@/app/(auth)/_components/BackButton";
import Logo from "@/app/(auth)/_components/LogoLow";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

// 인증 완료 query 를 감지해서 Zustand에 반영
function VerifiedQueryReader() {
  const params = useSearchParams();
  const setEmailVerified = useUserStore((s) => s.setEmailVerified);

  useEffect(() => {
    if (params.get("verified") === "1") {
      setEmailVerified(true);
    }
  }, [params, setEmailVerified]);

  return null;
}

export default function KakaoSettingClient() {
  const router = useRouter();
  const { user, emailForVerification, setEmailForVerification, setUser, emailVerified, setEmailVerified } =
    useUserStore();

  const [email, setEmail] = useState(user.email || emailForVerification || "");
  const [univ, setUniv] = useState(user.extra?.university || "");
  const [dept, setDept] = useState(user.extra?.department || "");
  const [studentId, setStudentId] = useState(user.extra?.studentId || "");
  const [dorm, setDorm] = useState(user.address || "");
  const [loading, setLoading] = useState(false);

  const handleNext = () => {
    if (!email || !univ || !dept || !studentId || !dorm) {
      alert("모든 항목을 입력해주세요.");
      return;
    }
    setEmailForVerification(email);
    setUser({
      ...user,
      emailVerified: false,
      email,
      address: dorm,
      extra: { ...user.extra, university: univ, department: dept, studentId },
    });
    router.push("/signup/code?verified=1");
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const token = user.token?.accessToken;
      if (!token) {
        alert("인증 토큰이 없습니다. 다시 로그인해주세요.");
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${user._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Client-Id": process.env.NEXT_PUBLIC_CLIENT_ID!,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...user,
          email,
          emailVerified: true,
          address: dorm,
          extra: { ...user.extra, university: univ, department: dept, studentId },
        }),
      });
      if (!res.ok) throw new Error("업데이트 실패");

      await res.json();
      setUser({
        ...user,
        email,
        emailVerified: true,
        address: dorm,
        extra: { ...user.extra, university: univ, department: dept, studentId },
      });
      setEmailVerified(true);
      router.push("/school/home");
    } catch (e: any) {
      console.error(e);
      alert(e.message || "저장 중 오류 발생");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center p-6 bg-white">
      <Suspense fallback={null}>
        <VerifiedQueryReader />
      </Suspense>

      <BackButton />
      <Logo />
      <h2 className="mt-4 text-lg font-semibold">추가 정보 입력</h2>

      <div className="w-full max-w-sm mt-6 space-y-4">
        <Input
          placeholder="대학교 이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={!!emailForVerification}
        />
        <Input placeholder="대학교 이름" value={univ} onChange={(e) => setUniv(e.target.value)} />
        <Input placeholder="학과" value={dept} onChange={(e) => setDept(e.target.value)} />
        <Input placeholder="학번(전체)" value={studentId} onChange={(e) => setStudentId(e.target.value)} />
        <Input placeholder="기숙사 호관" value={dorm} onChange={(e) => setDorm(e.target.value)} />
      </div>

      {!emailVerified ? (
        <Button className="mt-8 w-full" onClick={handleNext} disabled={loading} type="primary">
          이메일 인증하기
        </Button>
      ) : (
        <Button className="mt-8 w-full" onClick={handleSave} disabled={loading} type="primary">
          {loading ? "저장 중..." : "완료하고 계속하기"}
        </Button>
      )}
    </main>
  );
}
