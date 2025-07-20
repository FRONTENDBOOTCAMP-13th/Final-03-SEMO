// ChatBubble.tsx
import Image from "next/image";

interface ChatBubbleProps {
  msg: {
    content: string;
    nickName: string;
    isMine: boolean;
    isWhisper?: boolean;
    toNickName?: string;
  };
}

const ChatBubble = ({ msg }: ChatBubbleProps) => {
  // 보내는 사람만 귓속말 정보 표시
  const renderWhisperInfo = () => {
    if (!msg.isWhisper || !msg.isMine || !msg.toNickName) return null;

    return (
      <div className="text-xs text-yellow-500 mb-1">
        💬 <span className="font-semibold">{msg.toNickName}</span>에게 귓속말
      </div>
    );
  };

  return msg.isMine ? (
    // 내가 보낸 메시지
    <div className="flex justify-end items-end gap-2 min-h-[104px] p-4">
      <div className="max-w-[70%] text-right">
        {renderWhisperInfo()}
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
        <span className="text-12 flex justify-center">{msg.nickName}</span>
      </div>
      <div className="max-w-[70%] text-left">
        <div className="px-4 py-3 rounded-xl text-16 bg-uni-gray-200 text-uni-black">{msg.content}</div>
      </div>
    </div>
  );
};

export default ChatBubble;
