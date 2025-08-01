"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface ChatRoomItemProps {
  postId: string;
  name: string;
  message: string;
  date: string;
  userId: string; // 상대방 유저 ID
}

const ChatRoomItem = ({ postId, name, message, date, userId }: ChatRoomItemProps) => {
  const router = useRouter();
  const [avatarUrl, setAvatarUrl] = useState("/assets/defaultImg.png");

  const getUserById = async (userId: string | number) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`, {
        headers: {
          "Client-Id": process.env.NEXT_PUBLIC_CLIENT_ID || "",
        },
        cache: "no-store",
      });
      const json = await res.json();
      return json.ok ? json.item : null;
    } catch (err) {
      console.error("유저 정보 불러오기 실패", err);
      return null;
    }
  };

  useEffect(() => {
    if (!userId) return;

    getUserById(userId).then((user) => {
      if (user?.image) {
        setAvatarUrl(`${process.env.NEXT_PUBLIC_API_URL}/${user.image}`);
      }
    });
  }, [userId]);

  return (
    <div
      onClick={() => router.push(`/school/market/posts/${postId}`)}
      className="flex items-center justify-between py-3 border-b cursor-pointer"
    >
      <div className="flex items-center">
        <Image src={avatarUrl} alt="avatar" width={40} height={40} className="rounded-full object-cover" />
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
