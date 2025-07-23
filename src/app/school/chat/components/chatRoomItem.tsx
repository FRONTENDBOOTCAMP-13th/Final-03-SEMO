// 동적을 위한 props
// interface ChatRoomItemProps {
//   avatar: string;
//   name: string;
//   message: string;
//   date: string;
//   unread: boolean;
// }
"use client";

import { useRouter } from "next/navigation";

const ChatRoomItem = () => {
  const router = useRouter();
  return (
    <div
      className="flex min-w-[320px] w-full max-w-[480px] items-center justify-between px-4 py-3 hover:bg-gray-50 cursor-pointer"
      onClick={() => router.push("/school/chat/chatRoom")}
    >
      <div className="flex items-center">
        <div className="rounded-full w-[70px] h-[70px] bg-uni-blue-400" />
        <div className="flex flex-col ml-4">
          <span className="font-bold text-uni-black text-16">조한솔</span>
          <span className="text-14 text-uni-gray-400 truncate max-w-[200px]">아 늦잠자고 싶다</span>
          <span className="text-14 text-uni-gray-400">2025-07-14</span>
        </div>
      </div>
      <span className="w-3 h-3 rounded-full bg-uni-blue-400" />
    </div>
  );
};

export default ChatRoomItem;
