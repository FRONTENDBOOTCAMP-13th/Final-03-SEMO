"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function Header({ title, backLink = "/", type = "default", onMeatballClick }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-3 py-2 sticky top-0 z-10">
      <div className="flex items-center justify-between h-11">
        {/* 왼쪽 화살표 */}
        <Link href={backLink} className="p-2 -ml-2 flex items-center justify-center">
          <ChevronLeft className="w-6 h-6 text-gray-600" />
        </Link>

        {/* 가운데 제목 */}
        <h1 className="absolute left-1/2 -translate-x-1/2 text-lg font-semibold text-black">{title}</h1>

        {/* 오른쪽 영역 */}
        <div className="w-10 h-10 flex items-center justify-center">
          {type === "meatball" && (
            <button
              onClick={() => {
                console.log("미트볼 버튼 클릭됨");
                onMeatballClick?.();
              }}
              className="p-2 flex items-center justify-center hover:bg-gray-50 rounded-full"
            >
              {/* 세로 점 3개 */}
              <div className="flex flex-col space-y-1">
                <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
              </div>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
