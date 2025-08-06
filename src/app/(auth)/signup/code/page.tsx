import type { Metadata } from "next";
import SignupCodeClient from "./codeForm";

export const metadata: Metadata = {
  title: "UniStuff | 회원가입 페이지",
  description: "UniStuff의 회원가입 페이지 입니다",
};

export default function SignupCodePage() {
  return <SignupCodeClient />;
}
