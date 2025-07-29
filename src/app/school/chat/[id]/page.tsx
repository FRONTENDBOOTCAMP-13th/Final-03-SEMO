"use client";

import { useParams, useSearchParams, notFound } from "next/navigation";
import { useEffect, useState } from "react";

import ProductInfo from "../components/productInfo";
import ChatBubbleList from "../components/chatBubbleList";
import InputChat from "../components/inputChat";
import TradeCheck from "../components/tradeCheck";
import TradeComplete from "../components/tradeComplete";
import TradeInfoBox from "../components/tradeInfoBox";

import { socket, useChatSocket } from "../../../api/chat/useChatSoket";
import { useChatStore } from "../../../api/chat/useChatStore";
import { useUserStore } from "@/store/userStore";

const ChatPage = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params?.id;

  const sellerId = searchParams.get("sellerId") || "";
  const productId = searchParams.get("productId") || "";
  const sellerNickName = searchParams.get("sellerNickName") || "";
  const autoJoin = searchParams.get("autojoin") === "true";
  const roomIdFromQuery = searchParams.get("roomId");

  const user = useUserStore((state) => state.user);
  const buyerId = user._id || "";
  const buyerNickName = user.name || "";

  const [joinedRoom, setJoinedRoom] = useState(false);
  const [isTradeDone, setIsTradeDone] = useState(false);
  const [productData, setProductData] = useState<any>(null);
  const [sellerInfo, setSellerInfo] = useState<any>(null);

  const isSeller = String(buyerId) === String(sellerId);

  // 글로벌 방 입장
  useChatSocket({ userId: String(buyerId), nickName: buyerNickName, roomId: "global" });

  // 자동 개인방 입장
  useEffect(() => {
    if (!joinedRoom && buyerId && sellerId && autoJoin && roomIdFromQuery) {
      handleJoinRoom(roomIdFromQuery);
    }
  }, [buyerId, sellerId, joinedRoom, autoJoin, roomIdFromQuery]);

  const handleJoinRoom = (targetRoomId: string) => {
    socket.emit(
      "createRoom",
      {
        roomId: targetRoomId,
        user_id: buyerId,
        hostName: buyerNickName,
        roomName: `${buyerNickName} <-> ${sellerNickName}`,
        autoClose: false,
      },
      (createRes: any) => {
        if (!createRes.ok) {
          console.warn("개인방 이미 존재:", createRes.message);
        }

        socket.emit(
          "joinRoom",
          {
            roomId: targetRoomId,
            user_id: buyerId,
            nickName: buyerNickName,
          },
          (joinRes: any) => {
            if (joinRes.ok) {
              console.log("개인방 입장 성공:", targetRoomId);
              useChatStore.getState().setRoomId(targetRoomId);
              setJoinedRoom(true);
            } else {
              console.warn("개인방 입장 실패:", joinRes.message);
            }
          }
        );
      }
    );
  };

  // 상품 정보 fetch
  useEffect(() => {
    if (productId) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${productId}`)
        .then((res) => res.json())
        .then((data) => setProductData(data.item));
    }
  }, [productId]);

  // 판매자 정보 fetch
  useEffect(() => {
    const token = user?.token?.accessToken;
    if (sellerId && token) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${sellerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => setSellerInfo(data.item))
        .catch((err) => console.error("판매자 정보 요청 실패:", err));
    }
  }, [sellerId]);

  if (!id) return notFound();

  // 계좌번호: seller → post fallback
  const accountNumber =
    sellerInfo?.extra?.bank && sellerInfo?.extra?.bankNumber
      ? `${sellerInfo.extra.bank} ${sellerInfo.extra.bankNumber}`
      : productData?.extra?.newAccount || "계좌 정보 없음";

  const location = productData?.extra?.location || "장소 정보 없음";

  return (
    <>
      {/* 상품정보: 판매자, 상품이름, 상품사진 */}
      <ProductInfo productId={productId} />

      {/* 개인채팅 시작 버튼 */}
      <div className="px-4 my-2">
        <button
          onClick={() => {
            if (roomIdFromQuery) {
              handleJoinRoom(roomIdFromQuery);
            } else {
              alert("roomId가 없습니다. 채팅을 시작할 수 없습니다.");
            }
          }}
          className="bg-uni-blue-500 text-uni-white px-4 py-2 rounded hover:bg-uni-blue-600"
          disabled={joinedRoom}
        >
          {joinedRoom ? "개인 채팅 중..." : "1:1 채팅 시작하기"}
        </button>
      </div>

      {/* 채팅내역 */}
      <ChatBubbleList />

      {/* 거래완료버튼: 판매자에게만 뜨도록 */}
      {!isTradeDone && <TradeCheck postId={productId} isSeller={isSeller} onComplete={() => setIsTradeDone(true)} />}

      {/* 거래완료버튼: 구매자에게 뜨도록(ㅇㅇㅇ님의 참여가 승인되었습니다.)  */}
      {isTradeDone && !isSeller && <TradeComplete buyerName={buyerNickName} />}

      {/* 거래완료되면 계좌번호, 거래장소 */}
      {isTradeDone && <TradeInfoBox location={location} accountNumber={accountNumber} />}

      {/* 채팅 인풋창*/}
      <InputChat userId={buyerId} nickName={buyerNickName} sellerId={sellerId} sellerNickName={sellerNickName} />
    </>
  );
};

export default ChatPage;
