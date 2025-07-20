// ChatBubbleList.tsx
"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useChatStore } from "../../chatRoom/useChatStore";
import ChatBubble from "./chatBubble";

interface ChatBubbleListProps {
  myUserId: string;
  myNickName?: string;
}

const ChatBubbleList = ({ myUserId, myNickName }: ChatBubbleListProps) => {
  const messages = useChatStore((state) => state.messages);
  const scrollRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();

  const currentNickName = myNickName || searchParams.get("nickName") || undefined;

  // 새 메시지가 올 때마다 스크롤을 맨 아래로
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const isMyMessage = (msg: any) => {
    return currentNickName ? msg.nickName === currentNickName : String(msg.user_id).trim() === String(myUserId).trim();
  };

  return (
    <div className="flex flex-col">
      {messages.map((msg: any, idx: number) => (
        <ChatBubble
          key={`${msg.id || idx}`}
          msg={{
            content: msg.content,
            nickName: msg.nickName,
            isMine: isMyMessage(msg),
            isWhisper: msg.msgType === "whisper",
            toNickName: msg.toNickName,
          }}
        />
      ))}
      <div ref={scrollRef} />
    </div>
  );
};

export default ChatBubbleList;
