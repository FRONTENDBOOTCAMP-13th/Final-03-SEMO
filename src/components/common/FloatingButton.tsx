"use client";

import Link from "next/link";
import { ReactNode } from "react";

interface FloatProps {
  href: string;
  icon: ReactNode;
  text: string;
}

export default function FloatingButton({ href, icon, text }: FloatProps) {
  return (
    <Link
      href={href}
      className="fixed bottom-24 right-5 px-4 py-3 rounded-full bg-uni-blue-400 text-uni-white shadow-lg flex items-center gap-2 z-1000"
    >
      {icon}
      <span className="text-20 font-medium whitespace-nowrap">{text}</span>
    </Link>
  );
}
