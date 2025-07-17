import Image from "next/image";

interface ChatBubbleProps {
  msg: {
    content: string;
    nickName: string;
    isMine: boolean;
  };
}

const ChatBubble = ({ msg }: ChatBubbleProps) => {
  return msg.isMine ? (
    <div className="flex justify-end items-end gap-2 min-h-[104px] p-4">
      <div className="max-w-[70%] text-right">
        <div className="bg-uni-blue-400 px-4 py-3 text-uni-white rounded-xl text-16">{msg.content}</div>
      </div>
      <div>
        <Image src="/assets/defaultImg.png" alt="내 아바타" width={40} height={40} className="rounded-full" />
        <span className="text-12 flex justify-center">나</span>
      </div>
    </div>
  ) : (
    <div className="flex justify-start items-end gap-2 min-h-[104px] p-4">
      <div>
        <Image src="/assets/defaultImg.png" alt="상대 아바타" width={40} height={40} className="rounded-full" />
        <span className="text-12 flex justify-center">{msg.nickName}</span>
      </div>
      <div className="max-w-[70%] text-left">
        <div className="bg-uni-gray-200 px-4 py-3 text-uni-black rounded-xl text-16">{msg.content}</div>
      </div>
    </div>
  );
};

export default ChatBubble;
