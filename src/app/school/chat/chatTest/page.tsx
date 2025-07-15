"use client";

import { useState } from "react";
import { useChatStore } from "./useChatStore";
import { socket, useChatSocket } from "./useChatSoket";
import ChatBubble from "../components/chatBubble/page";

const ChatTestPage = () => {
  const userId = "user";
  const nickName = "조한솔";
  const roomName = "테스트방";

  const [input, setInput] = useState("");
  const messages = useChatStore((state) => state.messages);

  useChatSocket({ userId, nickName, roomName });

  const handleSend = () => {
    if (input.trim()) {
      socket.emit("message", {
        msg: input,
        user_id: userId,
        nickName: nickName,
      });
      setInput("");
    }
  };

  return (
    <div className="p-4">
      <h1 className="mb-4 text-xl font-bold">채팅 테스트</h1>
      <div className="h-96 overflow-y-auto border rounded-lg">
        {messages.map((msg, idx) => {
          return (
            <ChatBubble
              key={idx}
              msg={{
                content: msg.content,
                nickName: msg.nickName,
                isMine: msg.user_id === userId,
              }}
            />
          );
        })}
      </div>
      <div className="flex gap-2 mt-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 px-2 py-1 border rounded"
          placeholder="메시지 입력"
        />
        <button onClick={handleSend} className="px-4 py-1 text-white bg-blue-500 rounded">
          전송
        </button>
      </div>
    </div>
  );
};

export default ChatTestPage;
