import Navigation from "@/components/common/Navigation";
import React from "react";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Navigation />
    </>
  );
}
