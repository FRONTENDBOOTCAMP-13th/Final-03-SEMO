import Client from "../_components/Client";
import LoginForm from "./loginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "UniStuff | 로그인 페이지",
  description: "UniStuff의 로그인 페이지 입니다",
};

export default function LoginPage() {
  return (
    <Client>
      <LoginForm />
    </Client>
  );
}
