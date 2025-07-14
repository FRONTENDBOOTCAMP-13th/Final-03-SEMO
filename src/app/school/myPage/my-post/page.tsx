"use client";

import { useState } from "react";

export default function MyPageMyPost() {
  const [activeTab, setActiveTab] = useState("전체");

  return (
    <div className="min-h-screen">
      {/* Tab Navigation */}
      <nav className="flex bg-white border-b border-gray-100">
        {["전체", "팔래요", "살래요", "모여요"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-4 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab
                ? "text-blue-400 border-blue-400"
                : "text-gray-500 border-transparent hover:text-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </nav>

      <main className="p-4 space-y-6">
        <p className="text-gray-500">현재 선택된 탭: {activeTab}</p>
      </main>
    </div>
  );
}
