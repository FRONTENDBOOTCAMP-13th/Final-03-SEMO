import MyPageHeader from "./_components/MyPageHeader";
import { UserProvider } from "@/contexts/UserContext";
import React from "react";

export default function MyPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <MyPageHeader />
      {children}
    </UserProvider>
  );
}
