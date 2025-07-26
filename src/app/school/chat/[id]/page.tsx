"use client";

import { useParams, useSearchParams } from "next/navigation";
import ProductInfo from "../components/productInfo";
import ChatBubbleList from "../components/chatBubbleList";
import InputChat from "../components/inputChat";
import { notFound } from "next/navigation";
import { socket /*useChatSocket*/, useChatSocket } from "../../../api/chat/useChatSoket";
import { useChatStore } from "../../../api/chat/useChatStore";
import { useEffect, useState } from "react";
import { useUserStore } from "@/store/userStore";

const ChatPage = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params?.id; // 채팅방 postId

  const sellerId = searchParams.get("sellerId") || "";
  const productId = searchParams.get("productId") || "";
  const sellerNickName = searchParams.get("sellerNickName") || "";

  const user = useUserStore((state) => state.user);
  const buyerId = user._id || "";
  const buyerNickName = user.name || "";

  const [joinedRoom, setJoinedRoom] = useState(false);
  useEffect(() => {
    console.log("채팅방 Id: ", id);
    console.log("구매자 Id: ", buyerId);
    console.log("상품 Id: ", productId);
    console.log("판매자 Id: ", sellerId);
    console.log("판매자 nickName: ", sellerNickName);
  }, []);

  useChatSocket({ userId: String(buyerId), nickName: buyerNickName, roomId: "global" });
  useEffect(() => {
    if (!joinedRoom && buyerId && sellerId) {
      console.log("buyerId:", buyerId);
      console.log("sellerId:", sellerId);
    }
  }, [buyerId, sellerId, joinedRoom]);

  const handleJoinRoom = () => {
    const privateRoomId = [sellerId, buyerId].sort().join("-");

    socket.emit(
      "createRoom",
      {
        roomId: privateRoomId,
        user_id: buyerId,
        hostName: buyerId,
        roomName: `${sellerId} <-> ${buyerId}`,
        autoClose: false,
      },
      (createRes: any) => {
        if (!createRes.ok) {
          console.warn("개인방 이미 존재:", createRes.message);
        }

        socket.emit(
          "joinRoom",
          {
            roomId: privateRoomId,
            user_id: buyerId,
            nickName: buyerNickName,
          },
          (joinRes: any) => {
            if (joinRes.ok) {
              console.log("개인방 입장 성공:", privateRoomId);
              useChatStore.getState().setRoomId(privateRoomId);
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
          onClick={handleJoinRoom}
          className="bg-uni-blue-500 text-uni-white px-4 py-2 rounded  hover:bg-uni-blue-600"
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
