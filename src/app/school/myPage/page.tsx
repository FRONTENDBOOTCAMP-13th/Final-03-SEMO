"use client";

import Link from "next/link";
import Image from "next/image";
import { User, Package, Star, Heart, Bell, Info, LogOut } from "lucide-react";
import { useMyPageData } from "@/lib/hooks/useMyPageData";
import ImageService from "@/lib/imageService";

export default function MyPage() {
  const { userData, postsCount, reviewsCount, bookmarksCount } = useMyPageData();

  const userProfileImage = ImageService.getSafeImageUrl(userData?.image, "/assets/defaultimg.png");

  return (
    <div className="px-4 py-6 space-y-6">
      {/* 사용자 프로필 */}
      <div className="flex flex-col items-center text-center bg-uni-white py-8">
        <div className="w-24 h-24 mb-4 bg-uni-gray-200 rounded-full flex items-center justify-center overflow-hidden relative">
          {userData?.image ? (
            <Image src={userProfileImage} alt="User Profile" fill style={{ objectFit: "cover" }} />
          ) : (
            <User className="w-12 h-12 text-uni-gray-500" />
          )}
        </div>
        <h2 className="text-20 font-semibold text-uni-black mb-1 font-pretendard">{userData?.name || "사용자 이름"}</h2>
        <p className="text-14 text-uni-gray-400 font-pretendard">{userData?.email || "사용자 이메일"}</p>
      </div>
      {/* 활동 요약 섹션 */}
      <div className="bg-uni-white">
        <div className="px-4 py-4 ">
          <h3 className="text-18 font-semibold text-uni-black font-pretendard">활동 요약</h3>
        </div>

        <div className="space-y-0">
          <Link
            href="/school/myPage/my-post" //내가 거래한 목록
            className="flex items-center justify-between py-4 px-4  "
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-uni-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-uni-blue-400" />
              </div>
              <div>
                <p className="font-medium text-uni-black font-pretendard">내 거래 목록</p>
                <p className="text-14 text-uni-gray-400 font-pretendard">{postsCount}건</p>
              </div>
            </div>
          </Link>
          <Link
            href="/school/myPage/review-to-write" //남길 수 있는 후기 목록
            className="flex items-center justify-between py-4 px-4  "
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-uni-blue-100 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-uni-blue-400" />
              </div>
              <div>
                <p className="font-medium text-uni-black font-pretendard">남길 수 있는 후기</p>
                <p className="text-14 text-uni-gray-400 font-pretendard">{reviewsCount}건</p>
              </div>
            </div>
          </Link>
          <Link
            href="/school/myPage/wishlist" //찜한 목록
            className="flex items-center justify-between py-4 px-4 "
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-uni-blue-100 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-uni-blue-400" />
              </div>
              <div>
                <p className="font-medium text-uni-black font-pretendard">찜한 목록</p>
                <p className="text-14 text-uni-gray-400 font-pretendard">{bookmarksCount}건</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
      {/* 상세 정보 및 설정 섹션 */}
      <div className="bg-uni-white">
        <div className="px-4 py-4 ">
          <h3 className="text-18 font-semibold text-uni-black font-pretendard">상세 정보 및 설정</h3>
        </div>

        <div className="space-y-0">
          <Link
            href="/school/myPage/account" //계정 설정
            className="flex items-center justify-between py-4 px-4  "
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-uni-gray-200 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-uni-gray-600" />
              </div>
              <span className="font-medium text-uni-black font-pretendard">계정 설정</span>
            </div>
          </Link>
          <Link
            href="/school/myPage/notifications" //알림 설정
            className="flex items-center justify-between py-4 px-4  "
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-uni-gray-200 rounded-lg flex items-center justify-center">
                <Bell className="w-5 h-5 text-uni-gray-600" />
              </div>
              <span className="font-medium text-uni-black font-pretendard">알림 설정</span>
            </div>
          </Link>
          <Link
            href="/school/myPage/app-info" //앱 정보(임시 페이지 이름)
            className="flex items-center justify-between py-4 px-4  "
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-uni-gray-200 rounded-lg flex items-center justify-center">
                <Info className="w-5 h-5 text-uni-gray-600" />
              </div>
              <span className="font-medium text-uni-black font-pretendard">앱 정보</span>
            </div>
          </Link>
          <Link
            href="/school/myPage/logout" //로그아웃
            className="flex items-center justify-between py-4 px-4 "
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-uni-gray-200 rounded-lg flex items-center justify-center">
                <LogOut className="w-5 h-5 text-uni-gray-600" />
              </div>
              <span className="font-medium text-uni-black font-pretendard">로그아웃</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
