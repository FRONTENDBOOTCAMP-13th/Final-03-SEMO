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
      className={`fixed bottom-24 left-4 right-4 py-4 bg-uni-blue-400 text-white font-medium rounded-lg shadow-lg hover:bg-blue-600 transition-all duration-100 hover:shadow-xl active:scale-98 ${className}`}
    >
      {children}
    </button>
  );
}
