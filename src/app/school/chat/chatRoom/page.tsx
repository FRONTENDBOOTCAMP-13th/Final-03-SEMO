"use client";

import { useChatSocket } from "./useChatSoket";
import ChatBubbleList from "../components/chatBubbleList/page";
import InputChat from "../components/inputChat/page";
import ProductInfo from "../components/productInfo/page";

const ChatRoom = () => {
  const userId = "hansol65";
  const nickName = "조한솔";
  const roomName = "테스트방";

  useChatSocket({ userId, nickName, roomName });

  return (
    <>
      <ProductInfo />
      <ChatBubbleList myUserId={userId} />
      <InputChat userId={userId} nickName={nickName} />
    </>
  );
};
export default ChatRoom;
