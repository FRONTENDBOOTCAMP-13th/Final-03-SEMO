"use client";

export function SkeletonCard() {
  return (
    <div className="block">
      <div className="bg-gray-300 rounded-lg w-full h-[160px]"></div>
      <div className="mt-2 h-4 bg-gray-300 rounded w-4/5"></div>
      <div className="mt-1 h-3 bg-gray-300 rounded w-3/5"></div>
    </div>
  );
}
