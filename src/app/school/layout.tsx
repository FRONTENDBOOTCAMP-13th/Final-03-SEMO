"use client";

import { ReactNode } from "react";
import { useRequireProfileCompletion } from "@/lib/useRequireProfile";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  useRequireProfileCompletion(); // 오직 내부 섹션에서만 실행
  return <>{children}</>;
}
