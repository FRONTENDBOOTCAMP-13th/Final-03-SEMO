import { getCachedUser } from "@/data/functions/myPage";
import Image from "next/image";
import { useEffect, useState } from "react";

interface TradeCompleteProps {
  buyerId: number;
  buyerName: string;
}

const TradeComplete = ({ buyerId, buyerName }: TradeCompleteProps) => {
  const [avatar, setAvatar] = useState("/assets/defaultImg.png");

  useEffect(() => {
    if (buyerId) {
      getCachedUser(buyerId).then((user) => {
        if (user?.image) {
          setAvatar(
            user.image.startsWith("http") ? user.image : `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL || ""}${user.image}`
          );
        }
      });
    }
  }, [buyerId]);

  return (
    <div className="flex items-center w-full min-w-[360px] max-w-[480px] bg-uni-white px-4 py-3 gap-2">
      {/* 승인 메시지 */}
      <div className="flex items-center gap-3">
        <div className="w-[56px] h-[56px]">
          <Image
            src={avatar}
            alt="프로필"
            width={56}
            height={56}
            className="rounded-full object-cover w-full h-full"
            onError={() => setAvatar("/assets/defaultImg.png")}
          />
        </div>
        <p className="text-16 text-uni-black">
          <span className="font-semibold text-uni-black">{buyerName}</span>님의
          <br />
          참여가 <span className="text-uni-blue-500 font-semibold">승인</span>되었습니다
        </p>
      </div>
    </div>
  );
};

export default TradeComplete;
