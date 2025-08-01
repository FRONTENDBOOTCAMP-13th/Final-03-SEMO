"use client";

import { notFound, useParams } from "next/navigation";
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
import Header from "@/components/common/Header";
import { getPost } from "@/app/api/market/functions/post";

const ChatPage = () => {
  const params = useParams();
  const postId = params?.id?.toString();
  const user = useUserStore((state) => state.user);
  const buyerId = String(user?._id || "");
  const buyerNickName = user?.name || "";

  const [joinedRoom, setJoinedRoom] = useState(false);
  const [postData, setPostData] = useState<any>(null);
  const [sellerInfo, setSellerInfo] = useState<any>(null);
  const [isTradeDone, setIsTradeDone] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const roomId = postData?.meta?.roomId;
  const sellerId = String(postData?.meta?.sellerId || "");
  const productId = postData?.productId || "";
  const isSeller = buyerId === sellerId;

  // 글로벌 룸 입장
  useChatSocket({ userId: buyerId, nickName: buyerNickName, roomId: "global" });

  // 게시글 정보 fetch
  useEffect(() => {
    if (!postId) return;
    setIsLoading(true);
    getPost(Number(postId))
      .then((res) => {
        if (res.ok) setPostData(res.item);
        else console.warn("게시글 정보를 불러오지 못했습니다.");
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [postId]);

  // 거래 완료 여부 판단
  useEffect(() => {
    if (postData?.extra?.crt === "거래완료") setIsTradeDone(true);
  }, [postData]);

  // 판매자 계좌정보 fetch
  useEffect(() => {
    const token = user?.token?.accessToken;
    if (!sellerId || !token) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${sellerId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Client-Id": process.env.NEXT_PUBLIC_CLIENT_ID || "",
      },
    })
      .then((res) => res.json())
      .then((data) => setSellerInfo(data.item))
      .catch(console.error);
  }, [sellerId, user]);

  const handleJoinRoom = (targetRoomId: string) => {
    socket.emit(
      "createRoom",
      {
        roomId: targetRoomId,
        user_id: buyerId,
        hostName: buyerNickName,
        roomName: `${buyerNickName} <-> ${postData?.user?.name || "판매자"}`,
        autoClose: false,
      },
      (createRes: any) => {
        if (!createRes.ok) console.warn("개인방 이미 존재");

        socket.emit(
          "joinRoom",
          {
            roomId: targetRoomId,
            user_id: buyerId,
            nickName: buyerNickName,
          },
          (joinRes: any) => {
            if (joinRes.ok) {
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

  // 예외 처리
  if (!postId) return notFound();
  if (isLoading) return <div className="text-center py-20">채팅방 정보를 불러오는 중입니다...</div>;
  if (!postData) return notFound();

  const accountNumber =
    sellerInfo?.extra?.bank && sellerInfo?.extra?.bankNumber
      ? `${sellerInfo.extra.bank} ${sellerInfo.extra.bankNumber}`
      : postData?.extra?.newAccount || "계좌 정보 없음";

  const location = postData?.extra?.location || "장소 정보 없음";

  return (
    <>
      <Header title="채팅" />
      <ProductInfo productId={productId} />

      <div className="px-4 my-2">
        <button
          onClick={() => roomId && handleJoinRoom(roomId)}
          className="bg-uni-blue-500 text-uni-white px-4 py-2 rounded hover:bg-uni-blue-600"
          disabled={joinedRoom || !roomId}
        >
          {joinedRoom ? "개인 채팅 중..." : "1:1 채팅 시작하기"}
        </button>
      </div>

      <ChatBubbleList />

      {!isTradeDone && (
        <TradeCheck
          postId={productId}
          isSeller={isSeller}
          onComplete={() => setIsTradeDone(true)}
          productExtra={postData?.extra || {}}
        />
      )}

      {isTradeDone && !isSeller && <TradeComplete buyerName={buyerNickName} />}
      {isTradeDone && <TradeInfoBox location={location} accountNumber={accountNumber} />}

      <InputChat
        userId={buyerId}
        nickName={buyerNickName}
        sellerId={sellerId}
        sellerNickName={postData?.user?.name || "판매자"}
      />
    </>
  );
};

export default ChatPage;
