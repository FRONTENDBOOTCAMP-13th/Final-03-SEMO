"use client";

import { useChatSocket } from "./useChatSoket";
import ChatBubbleList from "../components/chatBubbleList/page";
import InputChat from "../components/inputChat/page";
import ProductInfo from "../components/productInfo/page";
import { useSearchParams } from "next/navigation";

const ChatRoom = () => {
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
export default ChatRoom;
