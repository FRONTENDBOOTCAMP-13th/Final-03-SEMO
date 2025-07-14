import Link from "next/link";
import { User, Package, Star, Heart, Bell, Info, LogOut } from "lucide-react";

export default function MyPage() {
  return (
    <div className="px-4 py-6 space-y-6">
      {/* 사용자 프로필 */}
      <div className="flex flex-col items-center text-center bg-uni-white py-8">
        <div className="w-24 h-24 mb-4 bg-gray-200 rounded-full flex items-center justify-center">
          <User className="w-12 h-12 text-uni-gray-500" />
        </div>
        <h2 className="text-xl font-semibold text-uni-blackmb-1">이훈진</h2>
        <p className="text-sm text-uni-gray-400">hunjinjin@example.com</p>
      </div>
      {/* 활동 요약 섹션 */}
      <div className="bg-uni-white">
        <div className="px-4 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-black">활동 요약</h3>
        </div>

        <div className="space-y-0">
          <Link
            href="/school/myPage/my-post" //내가 거래한 목록
            className="flex items-center justify-between py-4 px-4 border-b border-gray-100 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-uni-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="font-medium text-black">내 거래 목록</p>
                <p className="text-sm text-uni-gray-400">2건</p>
              </div>
            </div>
          </Link>
          <Link
            href="/school/myPage/review-to-write" //남길 수 있는 후기 목록
            className="flex items-center justify-between py-4 px-4 border-b border-gray-100 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-uni-blue-100 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="font-medium text-black">남길 수 있는 후기</p>
                <p className="text-sm text-uni-gray-400">3건</p>
              </div>
            </div>
          </Link>
          <Link
            href="/school/myPage/wishlist" //찜한 목록
            className="flex items-center justify-between py-4 px-4 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-uni-blue-100 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="font-medium text-black">찜한 목록</p>
                <p className="text-sm text-uni-gray-400">1건</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
      {/* 상세 정보 및 설정 섹션 */}
      <div className="bg-uni-white">
        <div className="px-4 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-black">상세 정보 및 설정</h3>
        </div>

        <div className="space-y-0">
          <Link
            href="/school/myPage/account" //계정 설정
            className="flex items-center justify-between py-4 px-4 border-b border-gray-100 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-uni-gray-600" />
              </div>
              <span className="font-medium text-black">계정 설정</span>
            </div>
          </Link>
          <Link
            href="/school/myPage/notifications" //알림 설정
            className="flex items-center justify-between py-4 px-4 border-b border-gray-100 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                <Bell className="w-5 h-5 text-uni-gray-600" />
              </div>
              <span className="font-medium text-black">알림 설정</span>
            </div>
          </Link>
          <Link
            href="/school/myPage/app-info" //앱 정보(임시 페이지 이름)
            className="flex items-center justify-between py-4 px-4 border-b border-gray-100 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                <Info className="w-5 h-5 text-uni-gray-600" />
              </div>
              <span className="font-medium text-black">앱 정보</span>
            </div>
          </Link>
          <Link
            href="/school/myPage/logout" //로그아웃
            className="flex items-center justify-between py-4 px-4 border-b border-gray-100 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                <LogOut className="w-5 h-5 text-uni-gray-600" />
              </div>
              <span className="font-medium text-black">로그아웃</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
