"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="absolute top-5 left-4 border rounded-lg p-1 border-uni-gray-200"
      aria-label="뒤로가기"
    >
      <Image src="/assets/backArrow.svg" alt="뒤로가기" width={19} height={19} />
    </button>
  );
}
