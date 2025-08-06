"use client";

import { Bell } from "lucide-react";
import Image from "next/image";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";

export default function HomeHeader() {
  const { user } = useUserStore();
  const router = useRouter();

  const handleProfile = () => {
    router.push("/school/myPage");
  };

  return (
    <header className="flex items-center justify-between py-[10px] bg-uni-white" role="banner" aria-label="사이트 헤더">
      {/* 프로필 이미지 */}
      <div className="w-[32px] h-[32px] rounded-full overflow-hidden " role="region" aria-label="사용자 프로필">
        <button onClick={handleProfile} className="cursor-pointer">
          {user?.image ? (
            <Image
              src={`${user.image}`}
              alt={`${user.name || "User"} 프로필`}
              width={32}
              height={32}
              className="w-full h-full object-cover overflow-hidden "
            />
          ) : (
            <div
              className="w-full h-full bg-uni-gray-300 rounded-full flex items-center justify-center"
              aria-label="기본 프로필 이미지"
            ></div>
          )}
        </button>
      </div>

      {/* 로고 */}
      <div className="flex items-center gap-2" role="region" aria-label="알림">
        <Image src="/assets/unistuffLogo.svg" alt="UniStuff logo" width={32} height={32} />
        <span className="text-20 font-bold text-uni-black font-urbanist">UniStuff</span>
      </div>

      {/* 알람 */}
      <Bell size={24} />
      {/* 헤더 설명 (스크린 리더용) */}
      <div className="sr-only">
        사이트 헤더입니다. 왼쪽에는 프로필 버튼, 가운데에는 UniStuff 로고, 오른쪽에는 알림 버튼이 있습니다.
      </div>
    </header>
  );
}
