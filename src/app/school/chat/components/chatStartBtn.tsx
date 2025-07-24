// components/ChatStartButton.tsx
"use client";

import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";

interface ChatStartButtonProps {
  sellerId: string;
  sellerNickName: string;
  productId: string;
}

export default function ChatStartButton({ sellerId, sellerNickName, productId }: ChatStartButtonProps) {
  const router = useRouter();
  const buyerId = useUserStore((state) => state.user._id);

  if (String(buyerId) === sellerId) return null;

  const handleStartChat = async () => {
    if (!buyerId || !sellerId || !productId) {
      alert("채팅방 생성 정보가 부족합니다.");
      return;
    }

    const payload = {
      type: "chat",
      userId: buyerId,
      sellerNickName,
      title: `${buyerId} -> ${sellerId}`,
      content: "채팅을 시작합니다",
      productId,
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Client-Id": process.env.NEXT_PUBLIC_CLIENT_ID!,
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (json.ok === 1) {
        const postId = json.item._id;
        router.push(
          `/school/chat/${postId}?buyerId=${buyerId}&sellerId=${sellerId}&sellerNickName=${sellerNickName}&productId=${productId}`
        );
      } else {
        alert(`생성 실패: ${json.message}`);
      }
    } catch (error) {
      console.error("채팅 생성 에러:", error);
      alert("채팅방 생성 중 오류가 발생했습니다.");
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
