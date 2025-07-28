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
      console.log("🔍 채팅방 검색 시작");

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

      console.log("📦 채팅방 후보 수:", items.length);

      // ✅ 병렬로 상세 조회
      const detailPromises = items.map(async (post) => {
        try {
          const detailRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${post._id}`, {
            headers: {
              "Client-Id": process.env.NEXT_PUBLIC_CLIENT_ID!,
            },
          });
          const detailJson = await detailRes.json();
          return detailJson.item;
        } catch (err) {
          console.warn("조회 실패:", post._id, err);
          return null;
        }
      });

      const details = await Promise.all(detailPromises);

      const existing = details.find((detail) => {
        if (!detail) return false;
        return (
          String(detail.productId) === String(productId) &&
          String(detail.meta?.sellerId) === String(sellerId) &&
          String(detail.meta?.buyerId) === String(buyerId)
        );
      });

      if (existing) {
        const postId = existing._id;
        const roomId = existing.meta?.roomId || `room-${postId}`;
        console.log("✅ 기존 채팅방 재사용:", { postId, roomId });

        router.push(
          `/school/chat/${postId}?buyerId=${buyerId}&sellerId=${sellerId}&productId=${productId}&roomId=${roomId}`
        );
        return;
      }

      console.log("❌ 기존 채팅방 없음. 새로 생성합니다.");

      const roomId = nanoid();

      const payload = {
        type: "chat",
        userId: buyerId,
        title: `${buyerId} -> ${sellerId}`,
        content: "채팅을 시작합니다",
        productId,
        meta: {
          sellerId,
          buyerId,
          roomId,
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
          `/school/chat/${postId}?buyerId=${buyerId}&sellerId=${sellerId}&productId=${productId}&roomId=${roomId}`
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
      className="w-full bg-uni-blue-500 text-white py-3 rounded-md font-bold text-16 hover:bg-uni-blue-600"
    >
      채팅하기
    </button>
  );
}
