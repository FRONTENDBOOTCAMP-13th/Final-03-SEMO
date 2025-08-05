"use client";
import { useState } from "react";
import { Check } from "lucide-react";
import PopUp from "./popup";
import { useUserStore } from "@/store/userStore";
import { socket } from "@/app/api/chat/useChatSoket";
import { useChatStore } from "@/app/api/chat/useChatStore";
import { useSearchParams } from "next/navigation";

interface TradeCheckProps {
  onComplete: () => void;
  postId: string;
  isSeller: boolean;
  productExtra: any;
  postType?: string;
  productId?: string | number;
}

const TradeCheck = ({ onComplete, postId, isSeller, productExtra, productId, postType }: TradeCheckProps) => {
  const [showPopUp, setShowPopUp] = useState(false);
  const [isTradeCompleted, setIsTradeCompleted] = useState(false);

  const searchParams = useSearchParams();
  const buyerIdFromQuery = searchParams.get("buyerId") ?? undefined;
  const roomId = useChatStore.getState().currentRoomId;
  const sellerId = useUserStore.getState().user?._id;
  const sellerNickName = useUserStore.getState().user?.name;

  const handleConfirm = async () => {
    try {
      const token = useUserStore.getState().user?.token?.accessToken;
      if (!token) return alert("로그인이 필요합니다.");

      const buyerId = buyerIdFromQuery ?? productExtra?.buyerId;
      const currentParticipants = Number(productExtra?.participants ?? 1);
      const approvedUserIds = productExtra?.approvedUserIds ?? [];

      if (approvedUserIds.includes(buyerId)) {
        return alert("이미 승인된 사용자입니다.");
      }

      const updatedParticipants = currentParticipants - 1;
      const shouldComplete = postType === "groupPurchase" ? updatedParticipants <= 1 : true;

      const updatedExtra = {
        ...productExtra,
        participants: postType === "groupPurchase" ? updatedParticipants : productExtra?.participants,
        approvedUserIds: [...approvedUserIds, buyerId],
        ...(shouldComplete ? { crt: "거래완료" } : {}),
      };

      const headers = {
        "Content-Type": "application/json",
        "Client-Id": "febc13-final03-emjf",
        Authorization: `Bearer ${token}`,
      };

      // posts/:postId PATCH
      const postRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({
          ...(shouldComplete ? { type: "end" } : {}),
          extra: updatedExtra,
        }),
      });

      const postJson = await postRes.json();
      if (postJson.ok !== 1) throw new Error("Post 업데이트 실패");

      // products/:productId PATCH
      const productIdToPatch = productId ?? productExtra?.productId;
      if (productIdToPatch) {
        const productRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/seller/products/${productIdToPatch}`, {
          method: "PATCH",
          headers,
          body: JSON.stringify({ extra: updatedExtra }),
        });
        const productJson = await productRes.json();
        if (productJson.ok !== 1) throw new Error("상품 업데이트 실패");
      }

      // 승인 메시지 먼저 발송 공동구매일 경우
      if (postType === "groupPurchase") {
        socket.emit("message", {
          type: "approval",
          msgType: "individual",
          buyerId,
          msg: "공동구매에 승인되었습니다!",
          postId,
          roomId,
          timestamp: new Date().toISOString(),
          user_id: sellerId,
          nickName: sellerNickName,
        });
      }

      // 거래 완료 메시지 발송
      if (shouldComplete) {
        socket.emit("message", {
          type: "tradeDone",
          msgType: "all",
          buyerId,
          msg: "거래가 완료되었습니다. 새로고침을 눌러서 거래정보를 확인하세요",
          postId,
          productId: productIdToPatch,
          roomId,
          timestamp: new Date().toISOString(),
          user_id: sellerId,
          nickName: sellerNickName,
        });
      }

      setIsTradeCompleted(true);
      onComplete();
    } catch (err) {
      console.error("거래 승인 오류:", err);
      alert("승인 처리 중 오류가 발생했습니다.");
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
          <button
            className="w-[80px] flex flex-col items-center text-uni-black text-14"
            onClick={() => setShowPopUp(true)}
            disabled={isTradeCompleted}
          >
            <Check
              size={20}
              className={`mb-2 rounded-full ${isTradeCompleted ? "bg-uni-blue-500 text-white" : "bg-uni-gray-200 text-uni-gray-400"} p-1`}
            />
            {isTradeCompleted ? "완료됨" : "승인하기"}
          </button>
        </div>
      </div>
    </>
  );
};

export default TradeCheck;
