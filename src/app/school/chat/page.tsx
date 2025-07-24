"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const ChatLogin = () => {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [nickName, setNickName] = useState("");

  const handleEnterChat = (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId.trim() || !nickName.trim()) {
      alert("userId와 nickName을 모두 입력해주세요!");
      return;
    }

    router.push(`/school/chat/chatRoomTest?userId=${userId}&nickName=${nickName}`);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-6 px-4">
      <h1 className="text-3xl font-bold text-uni-black">Global Chat 로그인</h1>
      <p className="text-12 text-uni-black">채팅 테스트용입니다.</p>
      <p className="text-12 text-uni-black">3000, 3001로 접속해서 두개의 User ID, 닉네임적고 테스트해보세요</p>
      <form onSubmit={handleEnterChat} className="rounded-lg p-6 w-full max-w-sm flex flex-col gap-4">
        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-1">User ID</label>
          <input
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none"
            placeholder="예: 1"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-1">닉네임</label>
          <input
            value={nickName}
            onChange={(e) => setNickName(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none"
            placeholder="예: 한솔"
          />
        </div>
        <button
          type="submit"
          className="bg-uni-blue-400 text-white font-semibold py-2 rounded-md hover:bg-uni-blue-600"
        >
          채팅 입장
        </button>
      </form>
    </div>
  );
};

export default ChatLogin;
