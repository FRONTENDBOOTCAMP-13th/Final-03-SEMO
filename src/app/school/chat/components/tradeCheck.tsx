"use client";
import { useState } from "react";
import { Share, Check } from "lucide-react";
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
  productId?: string | number;
}

const TradeCheck = ({ onComplete, postId, isSeller, productExtra, productId }: TradeCheckProps) => {
  const [showPopUp, setShowPopUp] = useState(false);
  const [isTradeCompleted, setIsTradeCompleted] = useState(false);

  // 구매자 id를 가져오기 위한
  const searchParams = useSearchParams();
  const buyerIdFromQuery = searchParams.get("buyerId") ?? undefined;

  // 거래완료 메시지 우회를 위한
  const roomId = useChatStore.getState().currentRoomId;
  const sellerId = useUserStore.getState().user?._id;
  const sellerNickName = useUserStore.getState().user?.name;

  const handleConfirm = async () => {
    try {
      const token = useUserStore.getState().user?.token?.accessToken;

      if (!token) {
        alert("로그인 토큰이 없습니다. 다시 로그인해주세요.");
        return;
      }

      const headers = {
        "Content-Type": "application/json",
        "Client-Id": "febc13-final03-emjf",
        Authorization: `Bearer ${token}`,
      };

      // 1. posts/:postId 거래 완료 처리
      const postRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({
          type: "end",
          extra: {
            ...(productExtra || {}),
            crt: "거래완료",
          },
        }),
      });

      const postJson = await postRes.json();
      if (postJson.ok !== 1) {
        alert(`posts 거래완료 실패: ${postJson.message || "서버 오류"}`);
        return;
      }

      // market/products/:productId 거래 완료 처리
      const productIdToPatch = productId ?? productExtra?.productId;
      if (productIdToPatch) {
        const productRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/seller/products/${productIdToPatch}`, {
          method: "PATCH",
          headers,
          body: JSON.stringify({
            extra: {
              ...(productExtra || {}),
              crt: "거래완료",
            },
          }),
        });

        const productJson = await productRes.json();
        if (productJson.ok !== 1) {
          alert(`상품 거래완료 실패: ${productJson.message || "서버 오류"}`);
          return;
        }
      }

      // 완료 처리
      setIsTradeCompleted(true);
      onComplete();
    } catch (err) {
      console.error("거래 완료 에러:", err);
      alert("거래 완료 처리 중 오류가 발생했습니다.");
    } finally {
      setShowPopUp(false);
    }
    console.log("[판매자] emit 전 buyerIdFromQuery:", buyerIdFromQuery);
    console.log("[판매자] emit 전 productExtra.buyerId:", productExtra?.buyerId);

    const buyerId = buyerIdFromQuery ?? productExtra?.buyerId ?? useUserStore.getState().user?._id;
    console.log("🔍 [handleConfirm] 최종 buyerId:", buyerId);

    socket.emit("message", {
      msgType: "all",
      type: "tradeDone",
      msg: "거래가 완료되었습니다. 새로고침을 눌러서 거래정보를 확인하세요",
      postId,
      roomId,
      buyerId,
      productId: productId ?? productExtra?.productId,
      timestamp: new Date().toISOString(),
      user_id: sellerId, // 보내는 사람
      nickName: sellerNickName,
    });
    console.log("[판매자] socket.emit 완료됨");
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
