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
import { useUserStore } from "@/store/userStore";
import Header from "@/components/common/Header";
import PopUp from "@/components/common/PopUp";
import { useChatStore } from "@/store/useChatStore";

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
  const [postType, setPostType] = useState<string>(""); //
  const [sellerInfo, setSellerInfo] = useState<any>(null);
  const [showModal, setShowModal] = useState(true);

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
        if (!createRes.ok) console.warn("개인방 이미 존재:", createRes.message);
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

  // 상품 정보 fetch (posts/:productId)
  useEffect(() => {
    if (productId) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${productId}`, {
        headers: {
          "Client-Id": "febc13-final03-emjf",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setProductData(data.item);
          setPostType(data.item?.type || "");
        })
        .catch((err) => console.error("상품 데이터 가져오기 실패:", err));
    }
  }, [productId]);

  useEffect(() => {
    if (productData?.extra?.crt === "거래완료") {
      setIsTradeDone(true);
    }
  }, [productData]);

  useEffect(() => {
    const token = useUserStore.getState().user?.token?.accessToken;
    if (sellerId && token) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${sellerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Client-Id": "febc13-final03-emjf",
        },
      })
        .then((res) => res.json())
        .then((data) => setSellerInfo(data.item))
        .catch((err) => console.error("판매자 정보 요청 실패:", err));
    }
  }, [sellerId]);

  if (!id) return notFound();

  const accountNumber =
    sellerInfo?.extra?.bank && sellerInfo?.extra?.bankNumber
      ? `${sellerInfo.extra.bank} ${sellerInfo.extra.bankNumber}`
      : productData?.extra?.newAccount || "계좌 정보 없음";

  const location = productData?.extra?.location || "장소 정보 없음";

  return (
    <>
      <div className="mb-[56px]">
        <Header title="채팅" backLink="/school/chat" />
        {showModal && <PopUp onClose={() => setShowModal(false)} />}
        <ProductInfo productData={productData} />
        <ChatBubbleList />
        {!isTradeDone && (
          <TradeCheck
            postId={productId}
            productId={productData?.extra?.productId}
            productExtra={productData?.extra || {}}
            postType={postType}
            isSeller={isSeller}
            onComplete={() => setIsTradeDone(true)}
          />
        )}
        {isTradeDone && !isSeller && <TradeComplete buyerId={Number(buyerId)} buyerName={buyerNickName} />}
        {isTradeDone && <TradeInfoBox location={location} accountNumber={accountNumber} />}
      </div>
      <InputChat userId={buyerId} nickName={buyerNickName} sellerId={sellerId} sellerNickName={sellerNickName} />
    </>
  );
};

export default ChatPage;
