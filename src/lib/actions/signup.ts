"use client";

import { checkEmailDuplicate, checkNameDuplicate } from "./checkDuplicate";
import { User } from "@/types/user";

interface SignupParams {
  user: Partial<User>;
  setLoading: (loading: boolean) => void;
}

export const handleSignup = async ({ user, setLoading }: SignupParams) => {
  const { email, password, extra, address, name } = user;

  if (!extra?.university || !extra?.department || !extra?.studentId || !address || !name) {
    throw new Error("모든 항목을 입력해 주세요!");
  }

  if (!email) {
    throw new Error("이메일 정보가 없습니다. 처음 단계부터 다시 진행해주세요.");
  }

  try {
    setLoading(true);

    const emailCheck = await checkEmailDuplicate(email);
    if (!emailCheck.ok) {
      throw new Error(emailCheck.message); // 이미 가입한 이메일
    }

    const nameCheck = await checkNameDuplicate(name);
    if (!nameCheck.ok) {
      throw new Error(nameCheck.message); // 닉네임 중복
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
        extra,
      }),
    });

    const data = await res.json();

    if (!res.ok || data.ok !== 1) {
      throw new Error(data.message || `회원가입 실패: HTTP ${res.status}`);
    }

    return true;
  } catch (err) {
    console.error("회원가입 에러:", err);
    throw err;
  } finally {
    setLoading(false);
  }
};
