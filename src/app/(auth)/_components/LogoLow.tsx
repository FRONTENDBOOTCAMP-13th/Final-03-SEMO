'use client';

import Image from 'next/image';

const LogoLow = ({ size = 49 }: { size?: number }) => {
  return (
    <div className="flex items-center gap-1.5">
      <Image
        src="/assets/unistuffLogo.svg"
        alt="UniStuff 로고"
        width={size}
        height={size}
        priority
      />
      <span
        className="font-extrabold"
        style={{ fontSize: 'var(--text-35)', fontFamily: 'var(--font-pretendard, sans-serif)', color: 'var(--color-uni-black)' }}
      >UniStuff
      </span>
    </div>
  );
};

export default LogoLow;
