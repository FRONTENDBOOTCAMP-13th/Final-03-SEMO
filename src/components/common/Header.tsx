/**
 * @fileoverview 공통 헤더 컴포넌트
 *
 * @description
 * 앱 전체에서 사용되는 헤더 UI 컴포넌트입니다.
 * 두 가지 타입(기본, 미트볼)을 지원하며 각 페이지에서 Context를 통해 설정됩니다.
 *
 * @features
 * - 기본 타입: 뒤로가기 버튼 + 제목
 * - 미트볼 타입: 뒤로가기 버튼 + 제목 + 점3개 메뉴 버튼
 * - 반응형 디자인 및 접근성 고려
 * - 미트볼 버튼 클릭 시 콘솔 로그 출력
 */

"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";

interface HeaderProps {
  title: string;
  backLink?: string;
  type?: "default" | "meatball";
  onMeatballClick?: () => void;
}

export default function Header({ title, backLink = "/", type = "default", onMeatballClick }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const handleMeatballClick = () => {
    console.log("미트볼 버튼 클릭됨");
    console.log("미트볼 스파게티");
    setIsMenuOpen(!isMenuOpen);
    onMeatballClick?.();
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("keydown", handleEsc);
      // 스크롤 방지
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  return (
    <>
      <header className="bg-uni-white border-b border-uni-gray-200 px-3 py-2 sticky top-0 z-10">
        <div className="flex items-center justify-between h-11">
          {/* 왼쪽 화살표 */}
          <Link href={backLink} className="p-2 -ml-2 flex items-center justify-center">
            <ChevronLeft className="w-6 h-6 text-uni-gray-600" />
          </Link>

          {/* 가운데 제목 */}
          <h1 className="absolute left-1/2 -translate-x-1/2 text-18 font-semibold text-uni-black font-pretendard">
            {title}
          </h1>

          {/* 오른쪽 영역 */}
          <div className="w-10 h-10 flex items-center justify-center">
            {type === "meatball" && (
              <button
                onClick={handleMeatballClick}
                className="p-2 flex items-center justify-center hover:bg-uni-gray-100 rounded-full"
              >
                {/* 세로 점 3개 */}
                <div className="flex flex-col space-y-1">
                  <div className="w-1 h-1 bg-uni-gray-600 rounded-full"></div>
                  <div className="w-1 h-1 bg-uni-gray-600 rounded-full"></div>
                  <div className="w-1 h-1 bg-uni-gray-600 rounded-full"></div>
                </div>
              </button>
            )}
          </div>
        </div>
      </header>
      {isMenuOpen && (
        <div className="fixed inset-0 z-30 bg-transparent">
          {/* 드롭다운 메뉴 */}
          <div className="absolute top-15 left-0 w-full bg-uni-white shadow-lg" onClick={(e) => e.stopPropagation()}>
            {/* 메뉴 아이템들 */}
            <div>
              {/* 수정하기 */}
              <button className="w-full px-4 py-3 text-left flex items-center justify-between">
                <span className="text-16 text-uni-gray-600">수정하기</span>
              </button>

              {/* 삭제하기 */}
              <button className="w-full px-4 py-3 text-left flex items-center justify-between">
                <span className="text-16 text-uni-gray-600">삭제하기</span>
              </button>

              {/* 공유하기 */}
              <button className="w-full px-4 py-3 text-left flex items-center justify-between">
                <span className="text-16 text-uni-gray-600">공유하기</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
