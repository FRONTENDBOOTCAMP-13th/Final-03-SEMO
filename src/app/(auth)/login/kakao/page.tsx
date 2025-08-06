import type { Metadata } from "next";
import KakaoLoginClient from "./kakaoForm";

export const metadata: Metadata = {
  title: "UniStuff | 카카오 로그인 페이지",
  description: "UniStuff의 카카오 로그인 페이지 입니다",
};

export default function KakaoLoginPage() {
  return <KakaoLoginClient />;
}
