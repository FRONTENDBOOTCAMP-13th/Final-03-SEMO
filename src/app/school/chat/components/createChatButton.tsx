"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  buyerId: string;
  sellerId: string;
  sellerNickName: string;
  productId: string;
}

const CreateChatButton = ({ buyerId, sellerId, sellerNickName, productId }: Props) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCreateChatPost = async () => {
    setLoading(true);
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
      setLoading(false);

      if (json.ok === 1) {
        router.push(
          `/school/chat/${json.item._id}?buyerId=${buyerId}&sellerId=${sellerId}&sellerNickName=${sellerNickName}&productId=${productId}`
        );
      } else {
        alert(`실패: ${json.message}`);
      }
    } catch (err) {
      setLoading(false);
      alert("채팅방 생성 중 오류 발생");
      console.error(err);
    }
  };

  return (
    <button
      onClick={handleCreateChatPost}
      disabled={loading}
      className="mt-4 bg-uni-blue-500 text-white px-4 py-2 rounded"
    >
      {loading ? "채팅방 생성 중..." : "채팅하기"}
    </button>
  );
};

export default CreateChatButton;
