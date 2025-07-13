'use client';

import React, { useState } from 'react';

export default function BuyMarketPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'wish' | 'sell'>('wish');

  const tabMap = [
    { label: '전체', value: 'all' },
    { label: '사고싶어요', value: 'wish' },
    { label: '팔고싶어요', value: 'sell' },
  ];

  return (
    <div className="min-w-[320px] max-w-md mx-auto px-4 py-6 bg-uni-blue-100 min-h-screen">
      {/* 탭 버튼 */}
      <div className="flex justify-around mb-4 border-b">
        {tabMap.map(({ label, value }) => {
          const isActive = activeTab === value;

          return (
            <button
              key={value}
              onClick={() => setActiveTab(value)}
              className={`flex-1 text-center py-2 font-bold text-sm relative ${
                isActive ? 'text-blue-500' : 'text-gray-500'
              }`}
            >
              {label}
              {isActive && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-[3px] bg-blue-500 rounded-sm" />
              )}
            </button>
          );
        })}
      </div>

      {/* 탭에 따른 컨텐츠 */}
      {activeTab === 'wish' && (
        <p className="text-center text-gray-700 font-medium">살래요 아이템 목록</p>
      )}
      {activeTab === 'sell' && (
        <p className="text-center text-gray-700 font-medium">팔래요 아이템 목록</p>
      )}
      {activeTab === 'all' && (
        <p className="text-center text-gray-700 font-medium">전체 아이템 목록</p>
      )}
    </div>
  );
}