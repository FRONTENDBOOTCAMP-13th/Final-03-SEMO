/**
 * SectionHeader 컴포넌트
 *
 * 클릭 가능한 섹션 헤더로, 전체 탭에서 특정 탭으로 이동할 수 있는 기능을 제공합니다.
 *
 * @example
 * <SectionHeader
 *   title="팔고싶어요"
 *   targetTab="팔래요"
 *   onTabChange={setActiveTab}
 * />
 *
 * @param title - 표시할 제목 텍스트
 * @param targetTab - 클릭 시 이동할 탭 이름
 * @param onTabChange - 탭 변경 함수
 */

"use client";

import { ChevronRight } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  targetTab: string;
  onTabChange: (tab: string) => void;
}

export default function SectionHeader({ title, targetTab, onTabChange }: SectionHeaderProps) {
  const handleClick = () => {
    onTabChange(targetTab);
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center justify-between w-full mb-3 group hover:bg-uni-gray-100 rounded-lg p-2 transition-colors"
    >
      <h2 className="text-20 font-semibold text-uni-black font-pretendard  transition-colors ml-2">{title}</h2>
      <ChevronRight className="w-5 h-5 text-uni-gray-400  transition-colors mr-2" />
    </button>
  );
}
