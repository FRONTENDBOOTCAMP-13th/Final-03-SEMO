"use client";

export default function MyPageNotifications() {
  return (
    <main className="p-4">
      <h1 className="text-xl font-bold mb-4">알림 설정</h1>
      <div className="space-y-4">
        <div className="flex justify-between border p-3 rounded">
          <span>마케팅 알림</span>
          <input type="checkbox" />
        </div>
        <div className="flex justify-between border p-3 rounded">
          <span>거래 알림</span>
          <input type="checkbox" />
        </div>
      </div>
    </main>
  );
}
