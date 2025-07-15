'use client';
import React, { useState } from 'react';
import ItemSection from './itemSection';
import FloatingButton from "@/components/common/FloatingButton";
import Search from "@/components/common/Search";

export default function BuyMarketPage() {
  const [activeTab, setActiveTab] = useState<'wish' | 'sell'>('wish');

  const tabMap = [
    { label: '사고싶어요', value: 'wish' },
    { label: '팔고싶어요', value: 'sell' },
  ];

  const wishList = [
    { id: 1, title: '치킨 깊티 구해요!', img: '/' },
    { id: 2, title: '컵라면 하나만요ㅠ', img: '/' },
    { id: 3, title: '치킨 깊티 구해요!', img: '/' },
    { id: 4, title: '컵라면 하나만요ㅠ', img: '/' },
    { id: 5, title: '치킨 깊티 구해요!', img: '/' },
    { id: 6, title: '컵라면 하나만요ㅠ', img: '/' },
  ];

  const sellList = [
    { id: 1, title: '치킨 깊티 구해요!', img: '/' },
    { id: 2, title: '컵라면 하나만요ㅠ', img: '/' },
    { id: 3, title: '치킨 깊티 구해요!', img: '/' },
    { id: 4, title: '컵라면 하나만요ㅠ', img: '/' },
    { id: 5, title: '치킨 깊티 구해요!', img: '/' },
    { id: 6, title: '컵라면 하나만요ㅠ', img: '/' },
  ];

  return (
    <div className="px-5 py-1 bg-uni-white min-h-screen">
      <Search />

      {/* 탭 */}
      <div className="flex justify-around mb-4 border-b border-uni-gray-300">
        {tabMap.map(({ label, value }) => {
          const isActive = activeTab === value;
          return (
            <button
              key={value}
              onClick={() => setActiveTab(value)}
              className={`flex-1 text-center py-2 font-bold text-14 relative ${
                isActive ? 'text-uni-blue-400' : 'text-uni-gray-500'
              }`}
            >
              {label}
              {isActive && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-47 h-[3px] bg-uni-blue-400" />
              )}
            </button>
          );
        })}
      </div>

      {/* 리스트 변경 */}
      {activeTab === 'wish' && (
        <ItemSection title="사고싶어요" items={wishList} />
      )}
      {activeTab === 'sell' && (
        <ItemSection title="팔고싶어요" items={sellList} />
      )}
      <FloatingButton href={`/school/market/${activeTab}/new`} />
    </div>
  );
}