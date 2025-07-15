"use client";

import { useParams } from "next/navigation";

export default function MyPageWriteReview() {
  const { id } = useParams<{ id: string }>();

  return (
    <main className="p-4">
      <h1 className="text-xl font-bold mb-4">후기 남기기</h1>
      <p className="mb-4">거래 ID: {id}</p>
      <textarea className="w-full border p-2 rounded mb-4" rows={5} placeholder="후기를 작성해주세요."></textarea>
      <button className="px-4 py-2 bg-blue-500 text-white rounded">등록</button>
    </main>
  );
}
