"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getPosts, getPost } from "@/app/api/market/functions/post";
import ChatRoomItem from "../components/chatRoomItem";
import Header from "@/components/common/Header";
import { useUserStore } from "@/store/userStore";
import type { Post } from "@/types/post";
import Head from "next/head";

const ChatRoomPage = () => {
  const user = useUserStore((state) => state.user);
  const [rooms, setRooms] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchRooms = async () => {
      if (!user || !user._id) return;

      try {
        const res = await getPosts("chat", 1, 30);
        if (!res.ok || !res.item) return;

        const items = Array.isArray(res.item) ? res.item : [res.item];
        const myId = String(user._id);

        const myRoomSummaries = items
          .filter((post): post is Post => !!post)
          .filter((post) => {
            const title = post.title?.replace(/\s/g, "");
            const [sender, receiver] = title?.split("->") || [];
            return sender === myId || receiver === myId;
          });

        const detailedRooms = await Promise.all(
          myRoomSummaries.map(async (post) => {
            const detailRes = await getPost(post._id);
            if (detailRes.ok && detailRes.item) return detailRes.item;
            return null;
          })
        );

        const filtered = detailedRooms.filter((r): r is Post => !!r);
        setRooms(filtered);
      } catch (e) {
        console.error("채팅방 불러오기 실패", e);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [user]);

  useEffect(() => {
    const handleClick = (e: Event) => {
      e.preventDefault();
      router.back();
    };

    const link = document.querySelector('a[href="#"]');
    if (link) {
      link.addEventListener("click", handleClick);
    }

    return () => {
      if (link) {
        link.removeEventListener("click", handleClick);
      }
    };
  }, [router]);

  return (
    <>
      <Head>
        <title>UniStuff | 채팅방 목록</title>
        <meta name="description" content="채팅방 목록을 확인하고 대화를 이어가세요." />
      </Head>
      <Header title="채팅" backLink="#" />
      <div className="max-w-[480px] mx-auto px-4 py-4">
        {loading ? (
          <div className="text-center text-gray-400 py-10">로딩 중...</div>
        ) : rooms.length === 0 ? (
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

export default ChatRoomPage;
