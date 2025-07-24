"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const CreateChatPost = () => {
  // "판매자 아이디"와 "상품 아이디"를 받고
  // "구매자"가 "채팅하기"를 눌러야 위 정보를 기반으로 채팅방(채팅게시물)이 생성되어야함
  const router = useRouter();
  const buyerId = "hansol";
  const [sellerId, setSellerId] = useState("");
  const [sellerNickName, setsellerNickName] = useState("");
  const [productId, setProductId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateChatPost = async () => {
    if (!sellerId || !productId) {
      // 임시로 입력을 받음
      // 원래는 게시물에 판매자와 상품아이디가 있어 그걸 받음
      alert("판매자 ID와 상품 ID를 입력해주세요");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("type", "chat");
    formData.append("userId", buyerId);
    formData.append("sellerNickName", sellerNickName);
    formData.append("title", `${buyerId} -> ${sellerId}`);
    formData.append("content", "채팅을 시작합니다");
    formData.append("productId", productId);
    console.log("요청 주소:", `${process.env.NEXT_PUBLIC_API_URL}/posts`);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Client-Id": process.env.NEXT_PUBLIC_CLIENT_ID!,
      },
      body: JSON.stringify(Object.fromEntries(formData.entries())),
    });

    const json = await res.json();
    setLoading(false);

    if (json.ok === 1) {
      alert(`채팅 게시글 생성 성공 postId: ${json.item._id}`);
      console.log("게시글 내용: ", json.item);

      router.push(
        `/school/chat/${json.item._id}?buyerId=${buyerId}&sellerId=${sellerId}&sellerNickName=${sellerNickName}&productId=${productId}`
      );
    } else {
      alert(`실패: ${json.message}`);
    }
  };
  return (
    <div className="max-w-md mx-auto p-6 bg-white border rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">채팅방 생성 (테스트)</h2>

      <div className="mb-3">
        <label className="block text-sm mb-1">판매자 ID</label>
        <input
          value={sellerId}
          onChange={(e) => setSellerId(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          placeholder="예: minji"
        />
      </div>

      <div className="mb-3">
        <label className="block text-sm mb-1">판매자 닉네임</label>
        <input
          value={sellerNickName}
          onChange={(e) => setsellerNickName(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          placeholder="예: 민지"
        />
      </div>

      <div className="mb-3">
        <label className="block text-sm mb-1">상품 ID</label>
        <input
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          placeholder="예: product-123"
        />
      </div>

      <button
        onClick={handleCreateChatPost}
        disabled={loading}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
      >
        {loading ? "생성 중..." : "채팅 게시글 생성"}
      </button>
    </div>
  );
};

export default CreateChatPost;
