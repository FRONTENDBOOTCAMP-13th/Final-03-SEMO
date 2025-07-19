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
  const roomId = useChatStore((state) => state.currentRoomId);
  const userList = useChatStore((state) => state.userList);
  const [whisperTargetId, setWhisperTargetId] = useState("all");

  const handleSend = () => {
    if (!input.trim() || !roomId) return;

    console.log("보내기 시도:", { input, roomId, whisperTargetId });

    if (whisperTargetId !== "all") {
      const targetUser = userList.find((u) => u.user_id === whisperTargetId);
      console.log("선택된 targetUser:", targetUser);
      if (!targetUser) return;

      // 귓속말 전송 - 예제 코드와 동일한 형식으로 수정
      socket.emit("sendTo", whisperTargetId, input);

      // 내가 보낸 귓속말을 내 화면에 표시
      const myWhisperMessage: Message = {
        id: Date.now().toString(),
        roomId: roomId,
        content: input,
        type: "text",
        msgType: "whisper",
        createdAt: new Date().toISOString(),
        user_id: userId,
        nickName: nickName,
        isMine: true,
        toUserId: targetUser.user_id,
        toNickName: targetUser.nickName,
      };
      useChatStore.getState().addMessage(myWhisperMessage);

      console.log("귓속말 전송 완료");
    } else {
      socket.emit("message", input); // 단순히 메시지 내용만 전송
      console.log("전체 메시지 전송 완료");
    }

    setInput("");
  };

  return (
    <div className="w-full min-w-[360px] max-w-[480px] px-4 py-3">
      <div className="flex gap-2">
        <select
          className="rounded-md border px-2 py-1 text-sm bg-white text-uni-black cursor-default"
          value={whisperTargetId}
          onChange={(e) => setWhisperTargetId(e.target.value)}
        >
          <option value="all">전체</option>
          {userList
            .filter((u) => u.user_id !== userId)
            .map((user) => (
              <option key={user.user_id} value={user.user_id}>
                {user.nickName} ({user.user_id})
              </option>
            ))}
        </select>

        <div className="flex items-center bg-uni-gray-200 rounded-[12px] h-12 w-full">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={
              whisperTargetId === "all"
                ? "메시지 입력..."
                : `${userList.find((u) => u.user_id === whisperTargetId)?.nickName || ""}에게 귓속말...`
            }
            className="w-full bg-transparent outline-none ml-4 my-2 mr-2 placeholder-uni-gray-600 text-16 text-uni-black"
          />
          <button onClick={handleSend} className="text-uni-black ml-[6px] my-[14px] mr-[14px]">
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InputChat;
