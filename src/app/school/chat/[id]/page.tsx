"use client";

import { useParams, useSearchParams } from "next/navigation";
import ProductInfo from "../components/productInfo";
import ChatBubbleList from "../components/chatBubbleList";
import InputChat from "../components/inputChat";
import { notFound } from "next/navigation";
import { socket, useChatSocket } from "../../../api/chat/useChatSoket";
import { useChatStore } from "../../../api/chat/useChatStore";
import { useEffect, useState } from "react";
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

  useEffect(() => {
    console.log("채팅방 Id:", id);
    console.log("구매자 Id:", buyerId);
    console.log("판매자 Id:", sellerId);
    console.log("Room ID from query:", roomIdFromQuery);
  }, []);

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

  if (!id) return notFound();

  return (
    <>
      <ProductInfo productId={productId} sellerId={sellerId} />
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
          {joinedRoom ? "개인 채팅 중..." : "민지와 1:1 채팅 시작하기"}
        </button>
      </div>
      <ChatBubbleList />
      <InputChat userId={buyerId} nickName={buyerNickName} sellerId={sellerId} sellerNickName={sellerNickName} />
    </>
  );
};

export default ChatPage;
