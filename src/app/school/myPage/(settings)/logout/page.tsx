import type { Metadata } from "next";
import LogoutClient from "./logoutForm";

export const metadata: Metadata = {
  title: "UniStuff – 로그아웃",
  description: "UniStuff 로그아웃 페이지입니다",
};

export default function LogoutPage() {
  return <LogoutClient />;
}
