"use client";

import { useState, useEffect } from "react";

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "기숙생을 위한 중고거래",
      sub: "공동구매 플랫폼",
      desc: "기숙생을 위한 중고 및 공동구매 플랫폼",
      bgColor: "bg-uni-gray-300",
    },
    {
      title: "함께 구매하면",
      sub: "더 저렴하게",
      desc: "공동구매로 더 합리적인 가격에 만나보세요",
      bgColor: "bg-uni-blue-300",
    },
    {
      title: "안전한 거래",
      sub: "믿을 수 있는 플랫폼",
      desc: "학교 인증으로 안전하고 신뢰할 수 있는 거래",
      bgColor: "bg-uni-green-200",
    },
  ];

  // 자동 슬라이드
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [slides.length]);
  return (
    <section className="-mx-4 mb-3 mt-3 relative overflow-hidden">
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`w-full h-60 ${slide.bgColor} flex flex-col items-start justify-center text-left flex-shrink-0`}
          >
            <h1 className="text-36 ml-5 font-bold text-white mb-4">
              {slide.title}
              <br />
              {slide.sub}
            </h1>
            <p className="text-14 ml-5 text-white">{slide.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
