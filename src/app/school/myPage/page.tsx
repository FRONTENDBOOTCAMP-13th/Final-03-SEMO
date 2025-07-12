import { User } from "lucide-react";

export default function myPage() {
  return (
    <div className="px-4 py-6 space-y-6">
      {/* 사용자 프로필 */}
      <div className="flex flex-col items-center text-center bg-white py-8">
        <div className="w-24 h-24 mb-4 bg-gray-200 rounded-full flex items-center justify-center">
          <User className="w-12 h-12 text-gray-500" />
        </div>
        <h2 className="text-xl font-semibold text-black mb-1">이훈진</h2>
        <p className="text-sm text-gray-400">hunjinjin@example.com</p>
      </div>
    </div>
  );
}
