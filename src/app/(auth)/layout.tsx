import type { Metadata } from "next";
import SignupLayoutClient from "./layout.client";

export const metadata: Metadata = {
  title: "UniStuff - 대학생 중고거래 및 공동구매",
  description: "대학생들을 위한 안전한 중고거래 및 공동구매 플랫폼",
};

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return <SignupLayoutClient>{children}</SignupLayoutClient>;
}
