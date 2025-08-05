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
  const roomIdFromUrl = searchParams.get("roomId") || "";

  const handleSend = () => {
    if (!input.trim() || !roomId) return;

    const isGlobalRoom = roomId === GLOBAL_ROOM_ID;
    const messageId = `${Date.now()}-${Math.random()}`; // 고유한 ID 생성
    const myUserId = String(userId);

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
        roomId: roomIdFromUrl,
      };
      console.log("귓속말 전송 데이터:", whisperPayload);

      // 귓속말 전송
      socket.emit("sendTo", sellerId, whisperPayload);

      const myWhisperMessage: Message = {
        id: messageId,
        roomId,
        content: input,
        type: "text",
        msgType: "whisper",
        createdAt: new Date().toISOString(),
        user_id: myUserId,
        nickName,
        toUserId: sellerId,
        toNickName: sellerNickName,
      };
      useChatStore.getState().addMessage(myWhisperMessage);

      socket.emit(
        "createRoom",
        {
          roomId: roomIdFromUrl,
          user_id: userId,
          hostName: nickName,
          roomName: `${nickName} <-> ${sellerNickName}`,
          autoClose: false,
        },
        () => {
          socket.emit(
            "joinRoom",
            {
              roomId: roomIdFromUrl,
              user_id: userId,
              nickName,
            },
            (res: any) => {
              if (res.ok) {
                useChatStore.getState().setRoomId(roomIdFromUrl);
                console.log("귓속말 후 개인방 자동 입장 성공:", roomIdFromUrl);
              } else {
                console.warn("개인방 자동 입장 실패:", res.message);
              }
            }
          );
        }
      );
    } else {
      // 개인방에서는 로컬에 먼저 추가
      const myMessage: Message = {
        id: messageId,
        roomId,
        content: input,
        type: "text",
        msgType: "all",
        createdAt: new Date().toISOString(),
        user_id: myUserId,
        nickName,
      };

      console.log("개인룸 메시지 전송:", myMessage);

      // 로컬에 즉시 표시
      useChatStore.getState().addMessage(myMessage);

      // 서버에 전송 (서버 응답은 무시됨)
      socket.emit("message", {
        msg: input,
        user_id: userId,
        nickName,
        roomId,
        timestamp: new Date().toISOString(),
      });
    }

    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="w-full min-w-[360px] max-w-[480px] px-4 py-3">
      <div className="flex items-center bg-uni-gray-100 rounded-lg h-12 flex-1">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`${sellerNickName}에게 메시지 보내기...`}
          className="flex-1 bg-transparent outline-none mx-4 placeholder-uni-gray-300 text-16 text-uni-black"
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
