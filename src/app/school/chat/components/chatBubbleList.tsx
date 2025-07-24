"use client";

import { useEffect, useRef } from "react";
// import { useSearchParams } from "next/navigation";
import { useChatStore } from "../../../api/chat/useChatStore";
import ChatBubble from "./chatBubble";
import { useUserStore } from "@/store/userStore";

// interface ChatBubbleListProps {
//   myUserId: string | number;
//   myNickName?: string;
// }

const ChatBubbleList = (/*{ myUserId, myNickName }: ChatBubbleListProps*/) => {
  const messages = useChatStore((state) => state.messages);
  const scrollRef = useRef<HTMLDivElement>(null);
  // const searchParams = useSearchParams();
  const user = useUserStore((state) => state.user);

  // const currentNickName = myNickName || searchParams.get("nickName") || undefined;

  // 새 메시지가 올 때마다 스크롤을 맨 아래로
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const isMyMessage = (msg: any) => {
    return String(msg.user_id) === String(user._id) || String(msg.toUserId) === String(user._id);
  };

  return (
    <div className="flex flex-col">
      {messages.map((msg: any, idx: number) => (
        <ChatBubble
          key={`msg-${msg.id}-${idx}`}
          msg={{
            content: msg.content,
            nickName: msg.nickName,
            isMine: isMyMessage(msg),
            msgType: msg.msgType,
            toNickName: msg.toNickName,
          }}
        />
      ))}
      <div ref={scrollRef} />
    </div>
  );
};

export default ChatBubbleList;
