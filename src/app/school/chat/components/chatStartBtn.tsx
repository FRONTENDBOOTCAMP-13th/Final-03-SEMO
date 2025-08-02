"use client";

import { useUserStore } from "@/store/userStore";
import { nanoid } from "nanoid";
import { useRouter } from "next/navigation";

interface ChatStartButtonProps {
  sellerId: string;
  productId: string;
}

export default function ChatStartButton({ sellerId, productId }: ChatStartButtonProps) {
  const router = useRouter();
  const buyerId = useUserStore((state) => state.user._id);

  if (String(buyerId) === sellerId) return null;

  const handleStartChat = async () => {
    if (!buyerId || !sellerId || !productId) {
      alert("채팅방 생성 정보가 부족합니다.");
      return;
    }

    try {
      // 기존 채팅 포스트 조회
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts?type=chat&productId=${productId}`, {
        headers: {
          "Client-Id": process.env.NEXT_PUBLIC_CLIENT_ID!,
        },
      });

      const json = await res.json();

      let items: any[] = [];
      if (Array.isArray(json.item)) items = json.item;
      else if (Array.isArray(json.items)) items = json.items;
      else if (json.item) items = [json.item];

      // content로 비교
      const expectedTitle = `${buyerId} -> ${sellerId}`;
      const existing = items.find((post) => post.title === expectedTitle);

      if (existing) {
        let roomIdFromMeta = existing.meta?.roomId;

        // roomId가 없으면 생성 후 PATCH
        if (!roomIdFromMeta) {
          roomIdFromMeta = nanoid();
          await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${existing._id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              "Client-Id": process.env.NEXT_PUBLIC_CLIENT_ID!,
            },
            body: JSON.stringify({
              meta: {
                ...existing.meta,
                roomId: roomIdFromMeta,
              },
            }),
          });
        }

        console.log("기존 채팅방 이동:", { postId: existing._id, roomIdFromMeta });

        router.push(
          `/school/chat/${existing._id}?buyerId=${buyerId}&sellerId=${sellerId}&productId=${productId}&roomId=${roomIdFromMeta}`
        );
        return;
      }

      // 채팅 포스트가 없으면 새로 생성
      const newRoomId = nanoid();

      const payload = {
        type: "chat",
        userId: buyerId,
        title: expectedTitle,
        content: "채팅을 시작합니다",
        productId,
        meta: {
          sellerId,
          buyerId,
          roomId: newRoomId,
        },
      };

      const createRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Client-Id": process.env.NEXT_PUBLIC_CLIENT_ID!,
        },
        body: JSON.stringify(payload),
      });

      const createJson = await createRes.json();

      if (createJson.ok === 1) {
        const postId = createJson.item._id;
        router.push(
          `/school/chat/${postId}?buyerId=${buyerId}&sellerId=${sellerId}&productId=${productId}&roomId=${newRoomId}&autojoin=true`
        );
      } else {
        alert(`채팅방 생성 실패: ${createJson.message}`);
      }
    } catch (error) {
      console.error("채팅 시작 에러:", error);
      alert("채팅방을 시작하는 중 오류가 발생했습니다.");
    }
  };

  return (
    <button
      onClick={handleStartChat}
      className="w-full bg-uni-blue-400 text-uni-white py-3 rounded-lg font-semibold text-16"
    >
      채팅하기
    </button>
  );
}
