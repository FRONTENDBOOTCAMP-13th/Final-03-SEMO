"use client";

export interface Review {
  id: number;
  title: string;
  author: string;
  image: string;
}

export default function MyPageReviewsToWrite() {
  return (
    <div className="bg-white min-h-screen p-4">
      <section>
        <h2 className="text-xl font-semibold mb-3 text-black">미작성 후기</h2>

        <div className="space-y-3">
          <div className="flex justify-between items-center p-4 border rounded">
            <span className="text-sm">인간관계론 2학년 교양</span>
            <button className="px-2 py-1 text-xs bg-blue-400 text-white rounded">후기 작성</button>
          </div>
        </div>
      </section>
    </div>
  );
}
