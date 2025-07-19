"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useChatStore } from "../../chatRoom/useChatStore";
import ChatBubble from "../chatBubble/page";

interface ChatBubbleListProps {
  myUserId: string;
  myNickName?: string; // 닉네임 추가
}

const ChatBubbleList = ({ myUserId, myNickName }: ChatBubbleListProps) => {
  const messages = useChatStore((state) => state.messages);
  const scrollRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();

  // URL에서 닉네임 가져오기 (prop으로 전달되지 않은 경우)
  const currentNickName = myNickName || searchParams.get("nickName") || undefined;

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col">
      {messages.map((msg, idx) => {
        // currentNickName이 있으면 닉네임으로, 없으면 user_id로 비교
        const isMine = currentNickName
          ? msg.nickName === currentNickName
          : String(msg.user_id).trim() === String(myUserId).trim();

        console.log(`Message ${idx}:`, {
          msg_user_id: msg.user_id,
          myUserId: myUserId,
          isMine: isMine,
          msgType: msg.msgType,
        });

        return (
          <ChatBubble
            key={idx}
            msg={{
              content: msg.content,
              nickName: msg.nickName,
              isMine: isMine,
              isWhisper: msg.msgType === "whisper",
              toNickName: msg.toNickName, // 받는 사람
              fromNickName: msg.nickName, // 보낸 사람 (ChatBubbleProps에 추가 필요)
            }}
          />
        );
      })}
      <div ref={scrollRef} />
    </div>
  );
};

export default ChatBubbleList;
