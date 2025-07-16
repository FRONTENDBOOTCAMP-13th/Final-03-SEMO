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
      className="flex items-center justify-between w-full mb-3 group hover:bg-uni-gray-100 rounded-lg p-2 -m-2 transition-colors"
    >
      <h2 className="text-20 font-semibold text-uni-black font-pretendard group-hover:text-uni-blue-400 transition-colors">
        {title}
      </h2>
      <ChevronRight className="w-5 h-5 text-uni-gray-400 group-hover:text-uni-blue-400 transition-colors" />
    </button>
  );
}
