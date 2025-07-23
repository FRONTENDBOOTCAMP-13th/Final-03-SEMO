"use client";

import { useChatSocket } from "../../../api/chat/useChatSoket";
import InputChat from "../components/inputChat";
// import ProductInfo from "../components/productInfo";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import ChatBubbleList from "../components/chatBubbleList";

const ChatRoomContent = () => {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId") ?? "defaultUser";
  const nickName = searchParams.get("nickName") ?? "익명";
  const roomId = "global";

  useChatSocket({ userId, nickName, roomId });

  return (
    <>
      {/* <ProductInfo /> */}
      <ChatBubbleList />
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
