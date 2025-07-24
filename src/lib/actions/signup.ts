"use client";

import { checkEmailDuplicate, checkNameDuplicate } from "./checkDuplicate";
import { User } from "@/types/user";
import { useRouter } from "next/navigation";

type Router = ReturnType<typeof useRouter>;

interface SignupParams {
  user: Partial<User>;
  setLoading: (loading: boolean) => void;
  router: Router;
}

export const handleSignup = async ({ user, setLoading, router }: SignupParams) => {
  const { email, password, university, department, studentId, dormitory, name } = user;

  if (!university || !department || !studentId || !name) {
    alert("모든 항목을 입력해 주세요!");
    return;
  }

  if (!email) {
    alert("이메일 정보가 없습니다. 처음 단계부터 다시 진행해주세요.");
    return;
  }

  try {
    setLoading(true);

    const emailCheck = await checkEmailDuplicate(email);
    if (!emailCheck.ok) {
      alert(emailCheck.message); // "이미 가입한 이메일입니다."
      return;
    }

    const nameCheck = await checkNameDuplicate(name);
    if (!nameCheck.ok) {
      alert(nameCheck.message); // "이미 사용 중인 닉네임입니다."
      return;
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Client-Id": process.env.NEXT_PUBLIC_CLIENT_ID ?? "",
      },
      body: JSON.stringify({
        email,
        password,
        name,
        type: "seller",
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
