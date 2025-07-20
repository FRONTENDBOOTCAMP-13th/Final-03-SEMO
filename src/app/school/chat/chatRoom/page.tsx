"use client";

import { useChatSocket } from "./useChatSoket";
import ChatBubbleList from "../components/chatBubbleList/chatBubbleList";
import InputChat from "../components/inputChat/input";
import ProductInfo from "../components/productInfo/page";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const ChatRoomContent = () => {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId") ?? "defaultUser";
  const nickName = searchParams.get("nickName") ?? "익명";
  const roomId = "global";

  useChatSocket({ userId, nickName, roomId });

  return (
    <>
      <ProductInfo />
      <ChatBubbleList myUserId={userId} />
      <InputChat userId={userId} nickName={nickName} />
    </>
  );
};

const ChatRoom = () => {
  return (
    <Suspense fallback={<div>채팅방을 로딩중...</div>}>
      <ChatRoomContent />
    </Suspense>
  );
};

export default ChatRoom;
