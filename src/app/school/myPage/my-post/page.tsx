"use client";

import { useState } from "react";

export default function MyPageMyPost() {
  const [activeTab, setActiveTab] = useState("전체");

  return (
    <div className="min-h-screen">
      <main className="p-4 space-y-6">
        <p className="text-gray-500">내 거래 목록 페이지</p>
      </main>
    </div>
  );
}
