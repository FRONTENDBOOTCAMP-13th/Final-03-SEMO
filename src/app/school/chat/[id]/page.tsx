"use client";

import { useParams, useSearchParams } from "next/navigation";
import ProductInfo from "../components/productInfo";
import ChatBubbleList from "../components/chatBubbleList";
import InputChat from "../components/inputChat";
import { notFound } from "next/navigation";
// import { useEffect } from "react";
import { socket, useChatSocket } from "../chatRoomTest/useChatSoket";
import { useChatStore } from "../chatRoomTest/useChatStore";

const ChatPage = () => {
  const params = useParams();
  const searchParams = useSearchParams();

  const id = params?.id; // 채팅방 postId
  const buyerId = searchParams.get("buyerId") || "";
  const sellerId = searchParams.get("sellerId") || "";
  const productId = searchParams.get("productId") || "";
  const sellerNickName = searchParams.get("sellerNickName") || "";

  console.log("채팅방 Id: ", id);
  console.log("구매자 Id: ", buyerId);
  console.log("상품 Id: ", productId);
  console.log("판매자 Id: ", sellerId);
  console.log("판매자 nickName: ", sellerNickName);

  useChatSocket({ userId: buyerId, nickName: buyerId, roomId: "global" });

  const handleJoinRoom = () => {
    const privateRoomId = [buyerId, sellerId].sort().join("-");

    socket.emit(
      "joinRoom",
      {
        roomId: privateRoomId,
        user_id: buyerId,
        nickName: buyerId,
      },
      (res: any) => {
        if (res.ok) {
          console.log("✅ 개인방 입장:", privateRoomId);
          useChatStore.getState().setRoomId(privateRoomId);
          handleJoinRoom();
        } else {
          console.warn("❌ 개인방 입장 실패:", res.message);
        }
      }
    );
  };
  if (!id) return notFound();

  return (
    <>
      <ProductInfo productId={productId} sellerId={sellerId} />
      <div className="px-4 my-2">
        <button onClick={handleJoinRoom} className="bg-uni-blue-500 text-uni-white px-4 py-2 rounded">
          {/* {handleJoinRoom ? "개인 채팅 중..." : "민지와 1:1 채팅 시작하기"} */}
        </button>
      </div>
      <ChatBubbleList myUserId={buyerId} />
      <InputChat userId={buyerId} nickName={sellerNickName} />
    </>
  );
};

export default ChatPage;
