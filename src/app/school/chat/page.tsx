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
      if (!user || !user._id) {
        setRooms([]);
        setLoading(false);
        return;
      }

      const myId = String(user._id);

      try {
        const res = await getPosts("chat");
        if (!res.ok || !res.item) {
          console.warn("게시글 응답 없음 또는 실패");
          setRooms([]);
          setLoading(false);
          return;
        }

        const items = Array.isArray(res.item) ? res.item : [res.item];

        const myRooms = items
          .filter((post) => {
            const title = post.title || "";
            const isMine = title.startsWith(`${myId} ->`) || title.endsWith(`-> ${myId}`);
            return isMine;
          })
          .sort((a, b) => {
            const aTime = new Date(a.updatedAt || "").getTime();
            const bTime = new Date(b.updatedAt || "").getTime();
            return bTime - aTime;
          });
        setRooms(myRooms);
      } catch (err) {
        console.error("채팅 목록 로딩 에러:", err);
        setRooms([]);
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
            const title = post.title || "";
            const myId = String(user._id);
            const parts = title.split("->").map((s) => s.trim());
            const otherId = parts[0] === myId ? parts[1] : parts[0];

            return (
              <ChatRoomItem
                key={post._id.toString()}
                postId={post._id.toString()}
                message={post.content || ""}
                date={post.updatedAt || ""}
                userId={otherId}
              />
            );
          })
        )}
      </div>
    </>
  );
};

export default ChatPage;
