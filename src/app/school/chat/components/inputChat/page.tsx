"use client";

import { Send } from "lucide-react";
import { useState } from "react";
import { socket } from "../../chatRoom/useChatSoket";
import { useChatStore } from "../../chatRoom/useChatStore";

interface InputChatProps {
  userId: string;
  nickName: string;
}

const InputChat = ({ userId, nickName }: InputChatProps) => {
  const [input, setInput] = useState("");
  const roomId = useChatStore((state) => state.currentRoomId);
  const userList = useChatStore((state) => state.userList);

  const handleSend = () => {
    if (!input.trim() || !roomId) return;

    socket.emit("message", {
      roomId,
      msg: input,
      user_id: userId,
      nickName,
    });

    setInput("");
  };

  return (
    <div className="w-full min-w-[360px] max-w-[480px] px-4 py-3">
      <div className="flex gap-2">
        <select className="rounded-md border px-2 py-1 text-sm bg-white text-uni-black cursor-default" disabled>
          <option>접속자 ({userList.length})</option>
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
            placeholder="메시지 입력..."
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
