"use client";

import { User } from "@/types/user";

interface LoginResult {
  ok: boolean;
  message: string;
  token?: string;
  user?: User;
}

export async function login(email: string, password: string): Promise<LoginResult> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/login?expiresIn=1d`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Client-Id": process.env.NEXT_PUBLIC_CLIENT_ID ?? "",
      },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        ok: false,
        message: result.message || "로그인 실패",
      };
    }

    return {
      ok: true,
      token: result.token?.accessToken,
      user: result.item,
      message: "로그인 성공",
    };
  } catch (err) {
    console.error("로그인 에러:", err);
    return {
      ok: false,
      message: "네트워크 오류 또는 서버 에러",
    };
  }
}
