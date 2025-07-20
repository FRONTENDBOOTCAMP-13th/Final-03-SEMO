"use client";

import Image from "next/image";

const LogoLow = ({ size = 49 }: { size?: number }) => {
  return (
    <div className="flex items-center gap-1.5">
      <Image src="/assets/unistuffLogo.svg" alt="UniStuff 로고" width={size} height={size} priority />
      <span className="font-extrabold text-35 font-pretendard,sans-serif color-uni-black">UniStuff</span>
    </div>
  );
};

export default LogoLow;
