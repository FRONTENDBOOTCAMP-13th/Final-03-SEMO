import { useState } from "react";
import { Share, Check } from "lucide-react";
import PopUp from "./popup";
import { useUserStore } from "@/store/userStore";

interface TradeCheckProps {
  onComplete: () => void;
  postId: string;
  isSeller: boolean;
}

const TradeCheck = ({ onComplete, postId, isSeller }: TradeCheckProps) => {
  const [showPopUp, setShowPopUp] = useState(false);
  const [isTradeCompleted, setIsTradeCompleted] = useState(false);

  const handleConfirm = async () => {
    try {
      const token = useUserStore.getState().user?.token?.accessToken;

      if (!token) {
        alert("로그인 토큰이 없습니다. 다시 로그인해주세요.");
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Client-Id": "febc13-final03-emjf",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          extra: {
            crt: "거래완료",
          },
        }),
      });
      const json = await res.json();
      console.log("거래 완료 응답:", json);

      if (json.ok) {
        setIsTradeCompleted(true);
        onComplete();
      } else {
        alert(`거래 완료 실패: ${json.message || "서버 오류"}`);
      }
    } catch (err) {
      console.error("거래 완료 에러:", err);
    } finally {
      setShowPopUp(false);
    }
  };

  if (!isSeller) return null;

  return (
    <>
      {showPopUp && <PopUp onClose={() => setShowPopUp(false)} onConfirm={handleConfirm} />}

      <div className="items-center w-full min-w-[360px] max-w-[480px] bg-uni-white px-4 py-3 gap-2">
        <div className="flex">
          <button className="w-[80px] flex flex-col items-center text-uni-black text-14">
            <Share size={20} className="mb-2" />
            공유하기
          </button>

          <button
            className="w-[80px] flex flex-col items-center text-uni-black text-14"
            onClick={() => setShowPopUp(true)}
            disabled={isTradeCompleted}
          >
            <Check
              size={20}
              className={`mb-2 rounded-full ${
                isTradeCompleted ? "bg-uni-blue-500 text-white" : "bg-uni-gray-200 text-uni-gray-400"
              } p-1`}
            />
            {isTradeCompleted ? "완료됨" : "거래 완료"}
          </button>
        </div>
      </div>
    </>
  );
};

export default TradeCheck;
