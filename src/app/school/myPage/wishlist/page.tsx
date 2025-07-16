"use client";

export default function MyPageWishlist() {
  return (
    <main className="p-4">
      <h1 className="text-xl font-bold mb-4">찜한 목록</h1>
      <div className="flex space-x-2 mb-4">
        <button className="px-4 py-2 border rounded">전체</button>
        <button className="px-4 py-2 border rounded">판매요</button>
        <button className="px-4 py-2 border rounded">살래요</button>
        <button className="px-4 py-2 border rounded">모아요</button>
      </div>
      <div className="border p-4 rounded">찜한 상품 목록이 여기에 표시됩니다.</div>
    </main>
  );
}
