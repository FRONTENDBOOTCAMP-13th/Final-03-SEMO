import type { Metadata } from "next";
import KakaoSettingClient from "./kakaoSettingForm";

export const metadata: Metadata = {
  title: "UniStuff | 카카오 추가 정보 입력",
  description: "카카오 로그인 후 추가 정보를 입력하는 페이지입니다",
};

export default function KakaoSettingPage() {
  return <KakaoSettingClient />;
}
