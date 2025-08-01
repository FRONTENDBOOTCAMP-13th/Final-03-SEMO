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
          setAvatar(`${process.env.NEXT_PUBLIC_API_URL}/${user.image}`);
        }
      }
    };

    fetchUser();
  }, [userId]);

  return (
    <div
      onClick={() => router.push(`/school/market/posts/${postId}`)}
      className="flex items-center justify-between py-3 border-b cursor-pointer"
    >
      <div className="flex items-center">
        <Image src={avatar} alt="avatar" width={40} height={40} className="rounded-full object-cover" />
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
