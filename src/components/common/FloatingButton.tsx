'use client';

import Link from 'next/link';

interface FloatProps {
  href: string;
}

export default function FloatingButton({ href }: FloatProps) {
  return (
    <Link
      href={href}
      className="fixed bottom-24 right-3 w-[55px] h-[55px] rounded-full bg-uni-blue-400 text-white text-30 shadow-lg flex items-center justify-center z-10"
    >
      +
    </Link>
  )
}
