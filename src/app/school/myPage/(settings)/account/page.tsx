"use client";

export default function MyPageAccount() {
  return (
    <main className="p-4">
      <h1 className="text-xl font-bold mb-4">계정 설정</h1>
      <div className="space-y-2">
        <div className="border p-3 rounded">닉네임 변경</div>
        <div className="border p-3 rounded">이메일 변경</div>
        <div className="border p-3 rounded">비밀번호 변경</div>
      </div>
    </main>
  );
}
