"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function OnboardingSliderForm() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleStartClick = () => {
    console.log("온보딩 완료 상태 업데이트됨");
    // 온보딩 완료 플래그 저장
    router.push("/login");
  };

  const goToSlide = (slideIndex: number) => {
    setCurrentSlide(slideIndex);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
    handleSwipe();
  };

  const handleSlideClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const screenWidth = rect.width;

    if (clickX < screenWidth / 3 && currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    } else if (clickX > (screenWidth * 2) / 3 && currentSlide < 3) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handleSwipe = () => {
    const minSwipeDistance = 50;
    const swipeDistance = touchEndX.current - touchStartX.current;

    if (swipeDistance < -minSwipeDistance && currentSlide < 3) {
      setCurrentSlide(currentSlide + 1);
    } else if (swipeDistance > minSwipeDistance && currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  return (
    <div
      className="onboarding-container w-full h-screen bg-white"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={handleSlideClick}
    >
      <div className="slider w-full h-screen relative overflow-hidden">
        <div
          className="slides flex w-[400%] h-full transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 25}%)` }}
        >
          {/* 슬라이드 1: 중고거래 */}
          <div className="slide w-1/4 h-full flex flex-col items-center justify-center px-8 pt-16 pb-32">
            <div className="slide-image w-24 h-24 mb-10 rounded-2xl bg-uni-blue-100 flex justify-center items-center text-4xl">
              <span className="text-uni-blue-400">🛒</span>
            </div>
            <h2 className="text-xl font-bold text-uni-black font-pretendard mb-5">안전한 중고거래</h2>
            <p className="text-center text-uni-gray-600 text-sm font-pretendard leading-relaxed max-w-xs">
              대학생 인증으로 더욱 안전하게
              <br />
              교내에서 편리한 거래를 시작하세요
            </p>
          </div>

          {/* 슬라이드 2: 커뮤니티 */}
          <div className="slide w-1/4 h-full flex flex-col items-center justify-center px-8 pt-16 pb-32">
            <div className="slide-image w-24 h-24 mb-10 rounded-2xl bg-uni-blue-100 flex justify-center items-center text-4xl">
              <span className="text-uni-blue-400">💬</span>
            </div>
            <h2 className="text-xl font-bold text-uni-black font-pretendard mb-5">활발한 커뮤니티</h2>
            <p className="text-center text-uni-gray-600 text-sm font-pretendard leading-relaxed max-w-xs">
              같은 대학 학생들과 소통하고
              <br />
              유용한 정보를 나누어보세요
            </p>
          </div>

          {/* 슬라이드 3: 실시간 채팅 */}
          <div className="slide w-1/4 h-full flex flex-col items-center justify-center px-8 pt-16 pb-32">
            <div className="slide-image w-24 h-24 mb-10 rounded-2xl bg-uni-blue-100 flex justify-center items-center text-4xl">
              <span className="text-uni-blue-400">📱</span>
            </div>
            <h2 className="text-xl font-bold text-uni-black font-pretendard mb-5">실시간 채팅</h2>
            <p className="text-center text-uni-gray-600 text-sm  font-pretendard leading-relaxed max-w-xs">
              빠르고 편리한 실시간 채팅으로
              <br />
              원활한 소통을 경험하세요
            </p>
          </div>

          {/* 슬라이드 4: 마이페이지 */}
          <div className="slide w-1/4 h-full flex flex-col items-center justify-center px-8 pt-16 pb-32">
            <div className="slide-image w-24 h-24 mb-10 rounded-2xl bg-uni-blue-100 flex justify-center items-center text-4xl">
              <span className="text-uni-blue-400">👤</span>
            </div>
            <h2 className="text-xl font-bold text-uni-black font-pretendard mb-5">맞춤형 관리</h2>
            <p className="text-center text-uni-gray-600 text-sm font-pretendard leading-relaxed max-w-xs">
              내 활동과 관심사를 한눈에
              <br />
              개인화된 서비스를 제공합니다
            </p>
          </div>
        </div>

        {/* 클릭 가이드 */}
        <div className="absolute top-1/2 left-4 transform -translate-y-1/2 text-uni-gray-400 text-sm opacity-30 select-none">
          ←
        </div>
        <div className="absolute top-1/2 right-4 transform -translate-y-1/2 text-uni-gray-400 text-sm opacity-30 select-none">
          →
        </div>

        {/* 슬라이드 인디케이터 */}
        <div className="dots absolute bottom-40 left-0 right-0 flex justify-center gap-3">
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              className={`dot rounded-full cursor-pointer transition-all duration-300 ${
                index === currentSlide ? "w-6 h-2 bg-uni-blue-400 shadow-lg" : "w-2 h-2 bg-uni-gray-300 "
              }`}
              onClick={(e) => {
                e.stopPropagation();
                goToSlide(index);
              }}
            />
          ))}
        </div>

        {/* 시작하기 버튼 */}
      </div>

      {/* SaveFloatingButton 스타일의 시작하기 버튼 */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleStartClick();
        }}
        className="fixed left-4 right-4 bottom-8 bg-uni-blue-400 text-uni-white py-3 font-pretendard font-semibold rounded-lg cursor-pointer"
      >
        시작하기
      </button>
    </div>
  );
}
