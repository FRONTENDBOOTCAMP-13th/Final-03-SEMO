"use client";

import { useState } from "react";
import { Share, Check } from "lucide-react";

const TradeCheck = () => {
  const [isTradeCompleted, setIsTradeCompleted] = useState(false);

  const tradeComplete = () => {
    setIsTradeCompleted((prev) => !prev);
  };

  return (
    <div className="items-center w-full min-w-[360px] max-w-[480px] bg-uni-white px-4 py-3 gap-2">
      {/* 공유하기 */}
      <div className="flex">
        <button className="w-[80px] flex flex-col items-center text-uni-black text-14">
          <Share size={20} className="mb-2" />
          공유하기
        </button>

        <button className="w-[80px] flex flex-col items-center text-uni-black text-14" onClick={tradeComplete}>
          <Check
            size={20}
            className={`mb-2 rounded-full   ${
              isTradeCompleted ? "bg-uni-blue-500 text-white" : "bg-uni-gray-200 text-uni-gray-400"
            } p-1`}
          />
          거래 완료
        </button>
      </div>
    </div>
  );
};

export default TradeCheck;
