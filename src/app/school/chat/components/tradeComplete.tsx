import { Share } from "lucide-react";
import Image from "next/image";

interface TradeCompleteProps {
  buyerName: string;
}

const TradeComplete = ({ buyerName }: TradeCompleteProps) => {
  return (
    <div className="flex items-center w-full min-w-[360px] max-w-[480px] bg-uni-white px-4 py-3 gap-2">
      {/* 공유하기 */}
      <button className="w-[80px] flex flex-col items-center text-uni-black text-14">
        <Share size={20} className="mb-2" />
        공유하기
      </button>

      {/* 승인 메시지 */}
      <div className="flex items-center gap-3">
        <Image src="/assets/defaultImg.png" alt="프로필" width={56} height={56} className="rounded-full" />
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
