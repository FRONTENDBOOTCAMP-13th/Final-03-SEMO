import { getCachedUser } from "@/data/functions/myPage";
import Image from "next/image";
import { useEffect, useState } from "react";

interface ChatBubbleProps {
  msg: {
    userId: number;
    content: string;
    nickName: string;
    isMine: boolean;
    msgType?: "all" | "whisper";
    toNickName?: string;
  };
}

const ChatBubble = ({ msg }: ChatBubbleProps) => {
  // const isWhisper = msg.msgType === "whisper";
  const [avatar, setAvatar] = useState("/assets/defaultImg.png");

  useEffect(() => {
    if (!msg.isMine && msg.userId) {
      getCachedUser(msg.userId).then((user) => {
        if (user?.image) {
          setAvatar(
            user.image.startsWith("http") ? user.image : `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL || ""}${user.image}`
          );
        }
      });
    }
  }, [msg.isMine, msg.userId]);

  return msg.isMine ? (
    // 내가 보낸 메시지
    <div className="flex justify-end items-end gap-2  p-4">
      <div className="max-w-[70%] text-right">
        <div className="px-4 py-3 rounded-xl text-16 break-words whitespace-pre-wrap bg-uni-blue-400 text-uni-white">
          {msg.content}
        </div>
      </div>
    </div>
  ) : (
    // 상대방이 보낸 메시지
    <div className="flex justify-start items-end gap-2 p-4">
      <div>
        <div className="w-[40px] h-[40px]">
          <Image
            src={avatar}
            alt="상대 아바타"
            width={40}
            height={40}
            className="rounded-full object-cover w-full h-full"
            onError={() => setAvatar("/assets/defaultImg.png")}
          />
        </div>
      </div>
      <div className="max-w-[70%] text-left">
        <div className="px-4 py-3 rounded-xl text-16 break-words whitespace-pre-wrap text-uni-black bg-uni-gray-200">
          {msg.content}
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;
