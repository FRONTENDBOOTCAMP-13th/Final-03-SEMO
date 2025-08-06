import type { Metadata } from "next";
import FindIdClient from "./idForm";

export const metadata: Metadata = {
  title: "UniStuff | 아이디 찾기 페이지",
  description: "UniStuff의 아이디 찾기 페이지 입니다",
};

export default function FindIdPage() {
  return <FindIdClient />;
}
