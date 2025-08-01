"use client";

import { useRouter } from "next/navigation";

interface ChatRoomItemProps {
  postId: string;
  name: string;
  message: string;
  date: string;
  avatar: string;
}

const ChatRoomItem = ({ postId, name, message, date, avatar }: ChatRoomItemProps) => {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/school/market/posts/${postId}`)}
      className="flex items-center justify-between py-3 border-b cursor-pointer"
    >
      <div className="flex items-center">
        <img src={avatar} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
        <div className="ml-3">
          <div className="font-semibold text-sm">{name}</div>
          <div className="text-xs text-gray-500 truncate max-w-[200px]">{message}</div>
        </div>
      </div>
      <div className="text-xs text-gray-400">{new Date(date).toLocaleDateString()}</div>
    </div>
  );
};

export default ChatRoomItem;
