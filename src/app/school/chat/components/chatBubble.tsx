// ChatBubble.tsx
import Image from "next/image";

interface ChatBubbleProps {
  msg: {
    content: string;
    nickName: string;
    isMine: boolean;
    msgType?: "all" | "whisper";
    toNickName?: string;
  };
}

const ChatBubble = ({ msg }: ChatBubbleProps) => {
  const isWhisper = msg.msgType === "whisper";

  return msg.isMine ? (
    // 내가 보낸 메시지
    <div className="flex justify-end items-end gap-2 min-h-[104px] p-4">
      <div className="max-w-[70%] text-right">
        {/* 귓속말인 경우 표시 */}
        {isWhisper && msg.toNickName && <div className="text-12 text-uni-gray-500 mb-1">귓속말 → {msg.toNickName}</div>}
        <div className="px-4 py-3 rounded-xl text-16 bg-uni-blue-400 text-uni-white">{msg.content}</div>
      </div>
      <div>
        <Image src="/assets/defaultImg.png" alt="내 아바타" width={40} height={40} className="rounded-full" />
        <span className="text-12 flex justify-center">나</span>
      </div>
    </div>
  ) : (
    // 상대방이 보낸 메시지
    <div className="flex justify-start items-end gap-2 min-h-[104px] p-4">
      <div>
        <Image src="/assets/defaultImg.png" alt="상대 아바타" width={40} height={40} className="rounded-full" />
        <span className="text-12 flex justify-center">{isWhisper ? `${msg.nickName} (귓속말)` : msg.nickName}</span>
      </div>
      <div className="max-w-[70%] text-left">
        <div className="px-4 py-3 rounded-xl text-16 text-uni-black bg-uni-gray-200">{msg.content}</div>
      </div>
    </div>
  );
};

export default ChatBubble;
