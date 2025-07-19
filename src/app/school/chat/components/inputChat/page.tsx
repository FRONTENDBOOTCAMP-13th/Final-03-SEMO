"use client";

import { Send } from "lucide-react";
import { useState } from "react";
import { socket } from "../../chatRoom/useChatSoket";
import { useChatStore, Message } from "../../chatRoom/useChatStore";

interface InputChatProps {
  userId: string;
  nickName: string;
}

const InputChat = ({ userId, nickName }: InputChatProps) => {
  const [input, setInput] = useState("");
  const [whisperTargetId, setWhisperTargetId] = useState("all");

  const roomId = useChatStore((state) => state.currentRoomId);
  const userList = useChatStore((state) => state.userList);

  const handleSend = () => {
    if (!input.trim() || !roomId) return;

    if (whisperTargetId === "all") {
      // 전체 메시지 전송
      socket.emit("message", input);
    } else {
      // 귓속말 전송
      const targetUser = userList.find((u) => u.user_id === whisperTargetId);
      if (!targetUser) return;

      socket.emit("sendTo", whisperTargetId, input);

      // 내가 보낸 귓속말을 내 화면에 표시
      const myWhisperMessage: Message = {
        id: Date.now().toString(),
        roomId,
        content: input,
        type: "text",
        msgType: "whisper",
        createdAt: new Date().toISOString(),
        user_id: userId,
        nickName,
        toUserId: targetUser.user_id,
        toNickName: targetUser.nickName,
      };

      useChatStore.getState().addMessage(myWhisperMessage);
    }

    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  const getPlaceholder = () => {
    if (whisperTargetId === "all") {
      return "메시지 입력...";
    }

    const targetUser = userList.find((u) => u.user_id === whisperTargetId);
    return `${targetUser?.nickName || ""}에게 귓속말...`;
  };

  return (
    <div className="w-full min-w-[360px] max-w-[480px] px-4 py-3">
      <div className="flex gap-2">
        {/* 수신자 선택 드롭다운 */}
        <select
          className="rounded-md border px-2 py-1 text-sm bg-white text-uni-black cursor-pointer"
          value={whisperTargetId}
          onChange={(e) => setWhisperTargetId(e.target.value)}
        >
          <option value="all">전체</option>
          {userList
            .filter((user) => user.user_id !== userId)
            .map((user) => (
              <option key={user.user_id} value={user.user_id}>
                {user.nickName}
              </option>
            ))}
        </select>

        {/* 메시지 입력 영역 */}
        <div className="flex items-center bg-uni-gray-200 rounded-[12px] h-12 flex-1">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={getPlaceholder()}
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
    </div>
  );
};

export default InputChat;
