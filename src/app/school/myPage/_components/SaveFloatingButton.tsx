/**
 * SaveFloatingButton 컴포넌트
 *
 * 화면 하단에 고정되어 노출되는 저장/등록 버튼 컴포넌트입니다.
 *
 * @example
 * <SaveFloatingButton onClick={handleSave}>
 *   저장하기
 * </SaveFloatingButton>
 *
 * @param children - 버튼 안에 들어갈 텍스트 혹은 컴포넌트
 * @param onClick - 버튼 클릭 시 호출될 이벤트 핸들러
 * @param className - 추가로 전달할 Tailwind CSS 클래스명
 */

"use client";

import { ReactNode } from "react";

interface FloatingButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

export default function SaveFloatingButton({ children, onClick, className = "" }: FloatingButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`fixed bottom-24 left-1/2 transform -translate-x-1/2 w-[calc(100%-2rem)] max-w-[448px] py-4 text-16 bg-uni-blue-400 text-uni-white font-medium font-pretendard rounded-lg shadow-lg hover:bg-uni-blue-500 transition-all duration-100 hover:shadow-xl active:scale-98 ${className}`}
    >
      {children}
    </button>
  );
}
