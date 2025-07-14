'use client';

import Link from 'next/link';

interface FloatProps {
  href: string;
}

export default function FloatingButton({ href }: FloatProps) {
  return (
    <Link
      href={href}
      className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-uni-blue-400 text-uni-white text-40 shadow-lg flex items-center justify-center z-50"
    >
      +
    </Link>
  );
}