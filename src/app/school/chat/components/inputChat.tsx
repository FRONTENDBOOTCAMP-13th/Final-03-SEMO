"use client";

import { Send } from "lucide-react";
import { useState } from "react";
import { GLOBAL_ROOM_ID, socket } from "../../../api/chat/useChatSoket";
import { useChatStore, Message } from "../../../api/chat/useChatStore";
import { useParams, useSearchParams } from "next/navigation";

interface InputChatProps {
  userId: string | number;
  nickName: string;
  sellerId: string;
  sellerNickName: string;
}

const InputChat = ({ userId, nickName, sellerId, sellerNickName }: InputChatProps) => {
  const [input, setInput] = useState("");
  const roomId = useChatStore((state) => state.currentRoomId);

  const params = useParams();
  const searchParams = useSearchParams();

  const productId = searchParams.get("productId");
  const postId = params?.id;

  const handleSend = () => {
    if (!input.trim() || !roomId) return;

    const isGlobalRoom = roomId === GLOBAL_ROOM_ID;

    if (isGlobalRoom) {
      const whisperPayload = {
        msg: input,
        user_id: userId,
        nickName,
        toUserId: sellerId,
        toNickName: sellerNickName,
        productId,
        buyerId: userId,
        sellerId,
        sellerNickName,
        postId,
      };
      console.log("귓속말 전송 데이터:", whisperPayload);

      // 귓속말 전송
      socket.emit("sendTo", sellerId, whisperPayload);

      const myWhisperMessage: Message = {
        id: Date.now().toString(),
        roomId,
        content: input,
        type: "text",
        msgType: "whisper",
        createdAt: new Date().toISOString(),
        user_id: String(userId),
        nickName,
        toUserId: sellerId,
        toNickName: sellerNickName,
      };
      useChatStore.getState().addMessage(myWhisperMessage);
    } else {
      const myMessage: Message = {
        id: Date.now().toString(),
        roomId,
        content: input,
        type: "text",
        msgType: "all",
        createdAt: new Date().toISOString(),
        user_id: String(userId),
        nickName,
      };

      console.log("개인룸 메시지 전송:", myMessage);

      useChatStore.getState().addMessage(myMessage);

      socket.emit("message", input);
    }

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
          placeholder={`${sellerNickName}에게 메시지 보내기...`}
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
