"use client";

import { Bell } from "lucide-react";
import Image from "next/image";
import { useUserStore } from "@/store/userStore";

export default function HomeHeader() {
  const { user } = useUserStore();
  return (
    <header className="flex items-center justify-between py-[10px] bg-uni-white">
      {/* 프로필 이미지 */}
      <div className="w-[32px] h-[32px] rounded-full overflow-hidden">
        {user?.image ? (
          <Image
            src={`${user.image}`}
            alt={`${user.name || "User"} 프로필`}
            width={32}
            height={32}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-uni-gray-300 rounded-full flex items-center justify-center"></div>
        )}
      </div>

      {/* 로고 */}
      <div className="flex items-center gap-2">
        <Image src="/assets/unistuffLogo.svg" alt="UniStuff logo" width={32} height={32} />
        <span className="text-20 font-bold text-uni-black">UniStuff</span>
      </div>

      {/* 알람 */}
      <Bell size={24} />
    </header>
  );
}
