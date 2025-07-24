"use client";

import { Send } from "lucide-react";
import { useState } from "react";
import { socket } from "../../../api/chat/useChatSoket";
import { useChatStore, Message } from "../../../api/chat/useChatStore";

interface InputChatProps {
  userId: string | number;
  nickName: string;
  sellerId: string;
  sellerNickName: string;
}

const InputChat = ({ userId, nickName, sellerId, sellerNickName }: InputChatProps) => {
  const [input, setInput] = useState("");

  const roomId = useChatStore((state) => state.currentRoomId);

  const handleSend = () => {
    if (!input.trim() || !roomId) return;

    // 귓속말 전송
    socket.emit("sendTo", sellerId, input);

    // 내가 보낸 귓속말을 내 화면에 표시
    const myWhisperMessage: Message = {
      id: Date.now().toString(),
      roomId,
      content: input,
      type: "text",
      msgType: "whisper",
      createdAt: new Date().toISOString(),
      user_id: userId.toString(),
      nickName,
      toUserId: sellerId,
      toNickName: sellerNickName,
    };

    useChatStore.getState().addMessage(myWhisperMessage);

    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="w-full min-w-[360px] max-w-[480px] px-4 py-3">
      <div className="flex items-center bg-uni-gray-200 rounded-[12px] h-12 flex-1">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`민지에게 귓속말 보내기...`}
          className="flex-1 bg-transparent outline-none mx-4 placeholder-uni-gray-600 text-16 text-uni-black"
        />
        <button
          onClick={handleSend}
          className="text-uni-black p-2 hover:opacity-70 transition-opacity"
          disabled={!input.trim()}
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default InputChat;
