"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUserStore } from "@/store/userStore";
import BackButton from "@/app/(auth)/_components/BackButton";
import Logo from "@/app/(auth)/_components/LogoLow";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

// useSerchParams() 사용때문에 변경
function VerifiedQueryReader({ setVerified }: { setVerified: (v: boolean) => void }) {
  const params = useSearchParams();
  const verifiedQuery = params.get("verified") === "1";

  useEffect(() => {
    setVerified(verifiedQuery);
  }, [verifiedQuery]);

  return null;
}

export default function KakaoSettingPage() {
  const router = useRouter();
  const {
    user,
    // code 페이지에서 setEmailForVerification(true) 할 때 저장된 값
    emailForVerification,
    // 스토어에 임시 이메일, 프로필 저장
    setEmailForVerification,
    setUser,
    // 최종 저장 완료 시 플래그
    emailVerified,
    setEmailVerified,
  } = useUserStore();

  const [verifiedQuery, setVerifiedQuery] = useState(false);

  // ① query 파라미터로도 받아오면 store에 옮기기
  useEffect(() => {
    if (verifiedQuery) {
      // code/page에서 setEmailVerified(true) 이미 되었으니
      // 여기서는 이메일을 다시 가로챈 뒤 버튼 표시용으로만 두면 됩니다.
    }
  }, [verifiedQuery]);

  // 1) 카카오 로그인 직후: user.email 이 없으므로 입력 받음
  const [email, setEmail] = useState(user.email || emailForVerification || "");
  const [univ, setUniv] = useState(user.extra?.university || "");
  const [dept, setDept] = useState(user.extra?.department || "");
  const [studentId, setStudentId] = useState(user.extra?.studentId || "");
  const [dorm, setDorm] = useState(user.address || "");
  const [loading, setLoading] = useState(false);

  // “이메일 인증하기” 눌렀을 때
  const handleNext = () => {
    if (!email || !univ || !dept || !studentId || !dorm) {
      alert("모든 항목을 입력해주세요.");
      return;
    }
    // 2) 코드 페이지로 넘기기 전, store에 임시값 저장
    setEmailForVerification(email);
    setUser({
      ...user,
      emailVerified: false, // 아직 인증 안 됨
      email, // 인증에 쓸 이메일
      address: dorm,
      extra: { ...user.extra, university: univ, department: dept, studentId },
    });
    router.push("/signup/code");
  };

  // “완료하고 계속하기” 눌렀을 때 백엔드에 최종 저장
  const handleSave = async () => {
    setLoading(true);
    try {
      const token =
        user.token?.accessToken || (typeof window !== "undefined" ? localStorage.getItem("accessToken") : "");
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

      // store 갱신
      setUser({
        ...user,
        emailVerified: true,
        email,
        address: dorm,
        extra: { ...user.extra, university: univ, department: dept, studentId },
      });
      setEmailVerified(true);

      // 홈으로 이동
      router.push("/school/home");
    } catch (e: any) {
      console.error(e);
      alert(e.message || "저장 중 오류 발생");
    } finally {
      setLoading(false);
    }
  };

  // 인증 페이지(code)에서 돌아왔을 때 버튼 보이게
  const canShowSave = emailVerified;

  return (
    <main className="min-h-screen flex flex-col items-center p-6 bg-white">
      <Suspense fallback={null}>
        <VerifiedQueryReader setVerified={setVerifiedQuery} />
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

      {!canShowSave ? (
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
