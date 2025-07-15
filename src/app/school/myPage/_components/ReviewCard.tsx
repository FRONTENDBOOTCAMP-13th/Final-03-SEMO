"use client";

export interface Review {
  id: number;
  title: string;
  author: string;
  image: string;
}

export default function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="flex justify-between items-center p-4 border rounded">
      <div className="flex items-center space-x-3">
        <span className="text-3xl">{review.image}</span>
        <div>
          <h3 className="text-sm font-semibold">{review.title}</h3>
          <p className="text-xs text-gray-500">{review.author}</p>
        </div>
      </div>
      <button className="px-2 py-1 text-xs bg-blue-400 text-white rounded">후기 작성</button>
    </div>
  );
}
