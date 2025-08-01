"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function OnboardingSlider() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleStartClick = () => {
    setShowOnboarding(true);
  };

  const handleSkipClick = () => {
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
    <>
      {/* 스플래시 스크린 */}
      {!showOnboarding && (
        <div className="splash-screen relative z-10 flex flex-col items-center justify-center min-h-screen px-8 text-center max-w-sm mx-auto py-20">
          <div className="app-logo relative w-20 h-20 rounded-xl liquid-glass flex justify-center items-center mb-5 shadow-2xl animate-fade-in transition-all duration-[400ms] ease-[cubic-bezier(0.175,0.885,0.32,2.2)]">
            <div className="absolute inset-0 bg-gradient-to-br from-uni-blue-400 to-uni-blue-600 rounded-xl opacity-90"></div>
            <img
              src="/assets/unistuffLogo.svg"
              alt="UNISTUFF Logo"
              className="relative z-10 w-12 h-12 filter brightness-0 invert"
            />
          </div>

          <h1 className="text-2xl font-bold text-uni-blue-400 mb-3 animate-fade-in-delay-1">UNISTUFF</h1>
          <p className="text-uni-gray-600 text-sm mb-12 leading-relaxed animate-fade-in-delay-2">
            대학생을 위한 올인원 플랫폼
            <br />
            중고거래부터 커뮤니티까지 한번에
          </p>
          <button
            onClick={handleStartClick}
            className="relative px-6 py-3 rounded-full liquid-glass text-black text-sm font-bold overflow-hidden transition-all duration-[400ms] ease-[cubic-bezier(0.175,0.885,0.32,2.2)]    animate-fade-in-delay-3 group"
          >
            <span className="relative z-20 font-semibold">시작하기</span>
          </button>
          <div className="absolute bottom-6 w-full text-center text-uni-gray-500 text-xs animate-fade-in-delay-4">
            created by SEMO팀
          </div>
        </div>
      )}

      {/* 온보딩 슬라이드 스크린 */}
      {showOnboarding && (
        <div
          className="onboarding-container absolute inset-0 z-10 bg-gradient-to-br from-uni-gray-100 via-uni-blue-100 to-uni-blue-200"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onClick={handleSlideClick}
        >
          {/* 배경 장식 요소들 */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-uni-blue-400 to-uni-blue-600 rounded-full opacity-10 animate-liquid-float"></div>
            <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-gradient-to-tr from-uni-blue-300 to-uni-blue-500 rounded-full opacity-15 animate-float"></div>
            <div className="absolute top-20 left-10 w-16 h-16 bg-gradient-to-br from-white to-uni-blue-200 rounded-full opacity-20 animate-pulse-slow"></div>
            <div
              className="absolute bottom-40 right-16 w-12 h-12 bg-gradient-to-br from-uni-blue-200 to-uni-blue-300 rounded-full opacity-25 animate-float"
              style={{ animationDelay: "1s" }}
            ></div>
            <div
              className="absolute top-1/3 left-1/4 w-8 h-8 bg-gradient-to-br from-uni-blue-200 to-uni-blue-400 rounded-full opacity-30 animate-float"
              style={{ animationDelay: "2.5s" }}
            ></div>
            <div
              className="absolute bottom-1/3 right-1/3 w-6 h-6 bg-gradient-to-br from-uni-blue-300 to-uni-blue-500 rounded-full opacity-35 animate-pulse-slow"
              style={{ animationDelay: "1.8s" }}
            ></div>
          </div>

          <div className="slider w-full h-screen relative overflow-hidden max-w-sm mx-auto">
            <div
              className="slides flex w-[400%] h-full transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 25}%)` }}
            >
              {/* 슬라이드 1: 중고거래 */}
              <div className="slide w-1/4 h-full flex flex-col items-center justify-center px-4">
                <div className="slide-image relative w-32 h-32 mb-6 rounded-2xl liquid-glass icon-container flex justify-center items-center text-4xl shadow-xl">
                  <span className="relative z-20 drop-shadow-lg text-black font-semibold">🛒</span>
                </div>
                <h2 className="text-lg font-bold text-uni-blue-400 mb-3">안전한 중고거래</h2>
                <p className="text-center text-uni-gray-600 text-sm mb-6 max-w-xs leading-relaxed">
                  대학생 인증으로 더욱 안전하게
                  <br />
                  교내에서 편리한 거래를 시작하세요
                </p>
              </div>

              {/* 슬라이드 2: 커뮤니티 */}
              <div className="slide w-1/4 h-full flex flex-col items-center justify-center px-4">
                <div className="slide-image relative w-32 h-32 mb-6 rounded-2xl liquid-glass icon-container flex justify-center items-center text-4xl shadow-xl">
                  <span className="relative z-20 drop-shadow-lg text-black font-semibold">💬</span>
                </div>
                <h2 className="text-lg font-bold text-uni-blue-400 mb-3">활발한 커뮤니티</h2>
                <p className="text-center text-uni-gray-600 text-sm mb-6 max-w-xs leading-relaxed">
                  같은 대학 학생들과 소통하고
                  <br />
                  유용한 정보를 나누어보세요
                </p>
              </div>

              {/* 슬라이드 3: 실시간 채팅 */}
              <div className="slide w-1/4 h-full flex flex-col items-center justify-center px-4">
                <div className="slide-image relative w-32 h-32 mb-6 rounded-2xl liquid-glass icon-container flex justify-center items-center text-4xl shadow-xl">
                  <span className="relative z-20 drop-shadow-lg text-black font-semibold">📱</span>
                </div>
                <h2 className="text-lg font-bold text-uni-blue-400 mb-3">실시간 채팅</h2>
                <p className="text-center text-uni-gray-600 text-sm mb-6 max-w-xs leading-relaxed">
                  빠르고 편리한 실시간 채팅으로
                  <br />
                  원활한 소통을 경험하세요
                </p>
              </div>

              {/* 슬라이드 4: 마이페이지 */}
              <div className="slide w-1/4 h-full flex flex-col items-center justify-center px-4">
                <div className="slide-image relative w-32 h-32 mb-6 rounded-2xl liquid-glass icon-container flex justify-center items-center text-4xl shadow-xl">
                  <span className="relative z-20 drop-shadow-lg text-black font-semibold">👤</span>
                </div>
                <h2 className="text-lg font-bold text-uni-blue-400 mb-3">맞춤형 관리</h2>
                <p className="text-center text-uni-gray-600 text-sm mb-6 max-w-xs leading-relaxed">
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
            <div className="dots absolute bottom-32 left-0 right-0 flex justify-center gap-3">
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
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSkipClick();
              }}
              className="absolute bottom-16 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-full liquid-glass text-black text-sm font-bold overflow-hidden transition-all duration-[400ms] ease-[cubic-bezier(0.175,0.885,0.32,2.2)] animate-fade-in-delay-3 group"
            >
              <span className="relative z-20 font-semibold">시작하기</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
