import type { Metadata } from "next";
import RootLayoutClient from "./layout.client";
import "./globals.css";

export const metadata: Metadata = {
  title: "UniStuff - 대학생 중고거래 플랫폼",
  description: "대학생들을 위한 안전한 중고거래 및 공동구매 플랫폼",
  icons: {
    icon: "/assets/uniStuffLogo.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
