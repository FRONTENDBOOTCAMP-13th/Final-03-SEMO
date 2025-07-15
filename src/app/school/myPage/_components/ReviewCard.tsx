"use client";

export default function ReviewCard() {
  return (
    <div className="flex justify-between items-center p-4 border rounded">
      <div className="flex items-center space-x-3">
        <span className="text-3xl">🧔</span>
        <div>
          <h3 className="text-sm font-semibold">인간관계론 2학년 교양</h3>
          <p className="text-xs text-gray-500">김지원</p>
        </div>
      </div>
      <button className="px-2 py-1 text-xs bg-blue-400 text-white rounded">후기 작성</button>
    </div>
  );
}
