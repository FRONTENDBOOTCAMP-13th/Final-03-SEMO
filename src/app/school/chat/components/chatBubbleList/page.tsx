"use client";

import { useEffect, useRef } from "react";
import { useChatStore } from "../../chatRoom/useChatStore";
import ChatBubble from "../chatBubble/page";

interface ChatBubbleListProps {
  myUserId: string;
}

const ChatBubbleList = ({ myUserId }: ChatBubbleListProps) => {
  const messages = useChatStore((state) => state.messages);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col">
      {messages.map((msg, idx) => {
        return (
          <ChatBubble
            key={idx}
            msg={{
              content: msg.content,
              nickName: msg.nickName,
              isMine: msg.user_id === myUserId,
            }}
          />
        );
      })}
      <div ref={scrollRef} />
    </div>
  );
};

export default ChatBubbleList;
