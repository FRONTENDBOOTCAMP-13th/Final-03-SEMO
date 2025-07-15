"use client";

import Link from "next/link";

export default function MyPageReviewsToWrite() {
  return (
    <main className="p-4">
      <h1 className="text-xl font-bold mb-4">남길 수 있는 후기 목록</h1>
      <ul className="space-y-2">
        <li className="border p-3 rounded">
          <div>거래 아이템 #1</div>
          <Link href="/school/myPage/write-review/1" className="text-blue-500">
            후기 남기기
          </Link>
        </li>
        <li className="border p-3 rounded">
          <div>거래 아이템 #2</div>
          <Link href="/school/myPage/write-review/2" className="text-blue-500">
            후기 남기기
          </Link>
        </li>
      </ul>
    </main>
  );
}
