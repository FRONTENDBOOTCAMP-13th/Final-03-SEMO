"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUserStore } from "@/store/userStore";

function KakaoLoginCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useUserStore();
  const calledRef = useRef(false);

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;

    const loginWithKakao = async () => {
      const code = searchParams.get("code");
      if (!code) {
        alert("인가 코드가 없습니다.");
        router.replace("/login");
        return;
      }

      const clientId = process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY ?? "";
      const redirectUri = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI ?? "";
      const clientSecret = process.env.NEXT_PUBLIC_KAKAO_CLIENT_SECRET ?? "";

      try {
        const tokenRes = await fetch("https://kauth.kakao.com/oauth/token", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            grant_type: "authorization_code",
            client_id: clientId,
            redirect_uri: redirectUri,
            client_secret: clientSecret,
            code,
          }),
        });

        const tokenData = await tokenRes.json();
        const accessToken = tokenData.access_token;
        if (!accessToken) throw new Error("access_token이 없습니다.");

        const profileRes = await fetch("https://kapi.kakao.com/v2/user/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
          },
        });

        const profile = await profileRes.json();
        console.log("[Kakao Profile]:", profile);

        const kakaoId = profile?.id?.toString() ?? "";

        if (!kakaoId) {
          console.error("kakaoId를 찾을 수 없음:", profile);
          return;
        }

        const emailRaw = profile.kakao_account?.email;
        const email = typeof emailRaw === "string" && emailRaw.includes("@") ? emailRaw : undefined;
        const nickname = profile.kakao_account?.profile?.nickname ?? "";
        const image = profile.kakao_account?.profile?.profile_image_url ?? "";

        // 1차 로그인 시도
        const loginRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/login/with`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Client-id": process.env.NEXT_PUBLIC_CLIENT_ID ?? "" },
          body: JSON.stringify({ providerAccountId: kakaoId }),
        });

        if (loginRes.ok) {
          const loginData = await loginRes.json();
          console.log("[LOGIN 응답]:", loginData);
          localStorage.setItem("accessToken", loginData.token);

          if (!loginData.item || !("_id" in loginData.item)) {
            console.warn("로그인 응답에 유저 정보 없음", loginData);
            return;
          }

          setUser(loginData.item);
          router.replace("/onBoarding");
          return;
        }

        // 2차 회원가입 시도
        //  1. 이메일 형식 검사 함수 정의
        const isValidEmail = (email: unknown): email is string => {
          return typeof email === "string" && email.includes("@");
        };

        //  2. signupBody 생성
        const signupBody = {
          type: "seller",
          loginType: "kakao",
          extra: { providerAccountId: kakaoId },
          name: nickname,
          image,
          ...(isValidEmail(email) ? { email } : {}),
        };

        console.log("signupBody to send", signupBody);
        console.log("as JSON", JSON.stringify(signupBody));

        //  3. fetch에 적용
        const signupRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/signup/oauth`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Client-id": process.env.NEXT_PUBLIC_CLIENT_ID ?? "" },
          body: JSON.stringify(signupBody),
        });
        console.log("전송할 JSON", JSON.stringify(signupBody));

        const signupData = await signupRes.json();
        console.log("[SIGNUP 응답]:", signupData);

        if (!signupData.user || !signupData.token) {
          console.error("user/token 응답 누락!", signupData);
          return;
        }

        localStorage.setItem("accessToken", signupData.token);
        setUser(signupData.user);
        console.log("[Zustand] setUser 호출됨 - 유저 저장 완료!");
        router.replace("/login");
      } catch (err) {
        console.error("카카오 로그인 실패", err);
        alert("카카오 로그인 중 오류 발생");
        router.replace("/login");
      }
    };

    loginWithKakao();
  }, [router, searchParams, setUser]);

  return <p className="text-center mt-20">카카오 로그인 중입니다...</p>;
}

// useSearchParams()를 사용하는 컴포넌트는 반드시 Suspense로 감싸야 함

import { Suspense } from "react";

export default function KakaoLoginPage() {
  return (
    <Suspense fallback={<p className="text-center mt-20">로딩 중...</p>}>
      <KakaoLoginCallback />
    </Suspense>
  );
}
