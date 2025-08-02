"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCachedUser } from "@/data/functions/myPage";

interface ChatRoomItemProps {
  postId: string;
  message: string;
  date: string;
  userId: string;
}

const ChatRoomItem = ({ postId, message, date, userId }: ChatRoomItemProps) => {
  const router = useRouter();
  const [name, setName] = useState(`상대방 ${userId}`);
  const [avatar, setAvatar] = useState("/assets/defaultImg.png");

  useEffect(() => {
    if (!userId) return;

    const fetchUser = async () => {
      const user = await getCachedUser(Number(userId));
      if (user) {
        setName(user.name || `상대방 ${userId}`);
        if (user.image) {
          setAvatar(user.image);
        }
      }
    };

    fetchUser();
  }, [userId]);

  return (
    <div
      onClick={() => router.push(`/school/market/posts/${postId}`)}
      className="flex items-center justify-between py-3 cursor-pointer h-[91px]"
    >
      <div className="flex items-center">
        <div className="w-[70px] h-[70px] rounded-full overflow-hidden">
          <Image src={avatar} alt="avatar" width={70} height={70} className="w-full h-full object-cover" />
        </div>
        <div className="ml-3">
          <div className="text-uni-black font-semibold text-16 mb-3">{name}</div>
          <div className="text-14 text-gray-500 truncate max-w-[200px]">{message}</div>
        </div>
      </div>
      <div className="text-14 text-gray-400">{new Date(date).toLocaleDateString()}</div>
    </div>
  );
};

export default ChatRoomItem;
