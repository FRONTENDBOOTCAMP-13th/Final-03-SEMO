"use client";

import { createPost } from "@/app/api/market/action/post";
import { useState } from "react";

const CreateChatPost = () => {
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    setLoading(true);

    const buyerId = "hansol";
    // const buyerNick = "한솔";
    const sellerId = "minji";
    // const sellerNick = "민지";
    const productId = "test-product-123";

    const formData = new FormData();
    formData.append("type", "chat");
    formData.append("userId", buyerId);
    formData.append("title", `${buyerId} -> ${sellerId}`);
    formData.append("content", "채팅을 시작합니다.");
    formData.append("productId", productId);

    const res = await createPost(null, formData);
    setLoading(false);

    if (res.ok) {
      console.log("채팅 게시글 생성 성공: ", res.item);
      alert(`게시글 생성완료 postId: ${res.item._id}`);
    } else {
      console.error("생성실패", res.message);
      alert(`실패: ${res.message}`);
    }
  };
  return (
    <div className="p-4 border rounded-md">
      <h2 className="text-lg font-bold mb-2">채팅 게시글 생성 테스트</h2>
      <button
        onClick={handleCreate}
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? "생성 중..." : "채팅하기 (테스트)"}
      </button>
    </div>
  );
};

export default CreateChatPost;
