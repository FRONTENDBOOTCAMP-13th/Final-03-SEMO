"use client";

import Image from "next/image";

import { useState, useEffect } from "react";

export const gradientOptions = {
  gray: "bg-gradient-to-t from-[#EDECEA] to-[#DED5CB]",
  blue: "bg-gradient-to-t from-[#71B2FF] to-[#2C81FF]",
  green: "bg-gradient-to-t from-[#A1A1F3] to-[#6C62F1]",
};

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "기숙생을 위한 중고거래",
      sub: "공동구매 플랫폼",
      desc: "기숙생을 위한 중고 및 공동구매 플랫폼",
      bgColor: gradientOptions.blue,
      assetImage: "/assets/School.svg",
      titleColor: "text-white",
      descColor: "text-white",
    },
    {
      title: "함께 구매하면",
      sub: "더 저렴하게",
      desc: "공동구매로 더 합리적인 가격에 만나보세요",
      bgColor: gradientOptions.gray,
      assetImage: "/assets/Together.svg",
      titleColor: "text-black",
      descColor: "text-black",
    },
    {
      title: "안전한 거래",
      sub: "믿을 수 있는 플랫폼",
      desc: "학교 인증으로 더욱 안전하게",
      bgColor: gradientOptions.green,
      assetImage: "/assets/face.svg",
      titleColor: "text-white",
      descColor: "text-white",
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
            className={`relative w-full h-[150px] ${slide.bgColor} flex flex-col items-start justify-center text-left flex-shrink-0`}
          >
            <h1 className={`text-22 ml-5 font-bold ${slide.titleColor} mb-4`}>
              {slide.title}
              <br />
              {slide.sub}
            </h1>
            <p className={`text-14 ml-5 ${slide.descColor}`}>{slide.desc}</p>
            <div className="absolute bottom-4 right-3 z-10">
              <Image src={slide.assetImage} alt={slide.title} width={110} height={110} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
