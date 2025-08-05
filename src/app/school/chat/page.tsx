"use client";

import { useEffect, useState } from "react";
import { getPosts } from "@/app/api/market/functions/post";
import ChatRoomItem from "./components/chatRoomItem";
import Header from "@/components/common/Header";
import { useUserStore } from "@/store/userStore";
import type { Post } from "@/types/post";

const ChatPage = () => {
  const user = useUserStore((state) => state.user);
  const [rooms, setRooms] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      if (!user || !user._id) return;

      try {
        const res = await getPosts("chat", 1, 30);
        if (!res.ok || !res.item) return;

        const items = Array.isArray(res.item) ? res.item : [res.item];
        const myId = String(user._id);

        const myRooms = items
          .filter((post): post is Post => !!post)
          .filter((post) => {
            const title = post.title?.replace(/\s/g, "");
            const [sender, receiver] = title?.split("->") || [];
            return sender === myId || receiver === myId;
          });

        setRooms(myRooms);
      } catch (e) {
        console.error("채팅방 불러오기 실패", e);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [user]);

  if (loading) {
    return (
      <>
        <Header title="채팅" />
        <div className="max-w-[480px] mx-auto px-4 py-4">
          <div className="text-center text-gray-400 py-10">로딩 중...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header title="채팅" />
      <div className="max-w-[480px] mx-auto px-4 py-4">
        {rooms.length === 0 ? (
          <div className="text-center text-gray-400 py-10">채팅방이 없습니다</div>
        ) : (
          rooms.map((post) => {
            const title = post.title?.replace(/\s/g, "") || "";
            const myId = String(user._id);
            const [sender, receiver] = title.split("->");
            const otherId = sender === myId ? receiver : sender;

            return (
              <ChatRoomItem
                key={post._id.toString()}
                postId={post._id.toString()}
                message={post.content || ""}
                date={post.updatedAt || ""}
                userId={otherId}
                buyerId={post.meta?.buyerId}
                sellerId={post.meta?.sellerId}
                productId={post.productId}
                roomId={post.meta?.roomId}
              />
            );
          })
        )}
      </div>
    </>
  );
};

export default ChatPage;
