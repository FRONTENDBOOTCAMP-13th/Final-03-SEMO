"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ChatStartButtonProps {
  sellerId: string;
  sellerNickName: string;
  productId: string;
}

export default function ChatStartButton({ sellerId, sellerNickName, productId }: ChatStartButtonProps) {
  const router = useRouter();
  const [buyerId, setBuyerId] = useState<string | null>(null);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const parsed = JSON.parse(user);
        setBuyerId(parsed._id);
      } catch (err) {
        console.error("유저 정보 파싱 실패", err);
      }
    }
  }, []);

  const handleStartChat = async () => {
    if (!buyerId || !sellerId || !productId) {
      alert("정보가 부족합니다.");
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
      const chatPostId = json.item._id;
      router.push(
        `/school/chat/${chatPostId}?buyerId=${buyerId}&sellerId=${sellerId}&sellerNickName=${sellerNickName}&productId=${productId}`
      );
    } else {
      alert(`채팅 게시글 생성 실패: ${json.message}`);
    }
  };

  return (
    <button
      onClick={handleStartChat}
      className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mt-4"
    >
      채팅방 만들기
    </button>
  );
}
