import MyPageHeader from "./_components/MyPageHeader";
import React from "react";

export default function MyPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MyPageHeader />
      {children}
    </>
  );
}
