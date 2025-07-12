"use client";

import { useState } from "react";
import { useChatStore } from "./useChatStore";
import { socket, useChatSocket } from "./useChatSoket";

export const ChatTestPage = () => {
  const userId = "user123";
  const nickName = "조한솔";
  const roomName = "테스트방";

  const [input, setInput] = useState("");
  const messages = useChatStore((state) => state.messages);
  const addMessage = useChatStore((state) => state.addMessage);

  useChatSocket({ userId, nickName, roomName });

  const handleSend = () => {
    if (input.trim()) {
      socket.emit("message", input);
      setInput("");
    }
  };
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">🧪 채팅 테스트</h1>
      <div className="border h-64 overflow-y-auto mb-2 p-2">
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
        className="border px-2 py-1 w-full"
        placeholder="메시지 입력"
      />
    </div>
  );
};
