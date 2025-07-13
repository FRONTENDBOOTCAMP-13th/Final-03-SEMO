"use client";

import { useState } from "react";
import { useChatStore } from "./useChatStore";
import { socket, useChatSocket } from "./useChatSoket";

const ChatTestPage = () => {
  const userId = "user123";
  const nickName = "조한솔";
  const roomName = "테스트방";

  const [input, setInput] = useState("");
  const messages = useChatStore((state) => state.messages);

  useChatSocket({ userId, nickName, roomName });

  const handleSend = () => {
    if (input.trim()) {
      socket.emit("message", input);
      setInput("");
    }
  };

  return (
    <div className="p-4">
      <h1 className="mb-4 text-xl font-bold"> 채팅 테스트</h1>
      <div className="h-64 p-2 mb-2 overflow-y-auto border">
        {messages.map((msg, idx) => (
          <div key={idx} className="mb-1">
            <strong>익명:</strong> {msg.content}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        className="w-full px-2 py-1 border"
        placeholder="메시지 입력"
      />
    </div>
  );
};

export default ChatTestPage;
