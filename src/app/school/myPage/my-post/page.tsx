"use client";

import { useState } from "react";

export default function MyPageMyPost() {
  const [activeTab, setActiveTab] = useState("전체");

  // 테스트용 더미 데이터
  const sellItems = [
    {
      id: 1,
      title: "인센스 사실분?",
      price: "10,000원",
      image: "🕯️",
      status: "판매중",
    },
    {
      id: 2,
      title: "기숙사 공기에 좋은 선인장",
      price: "5,000원",
      image: "🌵",
      status: "판매중",
    },
  ];

  const buyItems = [
    {
      id: 3,
      title: "여행에서 헤어져서 폴라로이드 팝니다",
      price: "15,000원",
      image: "🏔️",
      status: "판매완료",
    },
    {
      id: 4,
      title: "노트북 팝니다ㅠ",
      price: "15,000원",
      image: "🏔️",
      status: "판매완료",
    },
  ];

  const gatheringsItems: any[] = [];

  const getStatusButton = (status: string) => {
    if (status === "판매중") {
      return <button className="px-4 py-2 bg-green-400 text-white text-sm rounded-lg font-medium ml-4">판매중</button>;
    } else {
      return <button className="px-4 py-2 bg-gray-400 text-white text-sm rounded-lg font-medium ml-4">판매완료</button>;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Tab Navigation */}
      <nav className="flex bg-white border-b border-gray-100">
        {["전체", "팔래요", "살래요", "모여요"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-4 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab
                ? "text-blue-400 border-blue-400"
                : "text-gray-500 border-transparent hover:text-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </nav>

      <main className="p-4 space-y-6">
        {/* 팔래요 Section */}
        {(activeTab === "전체" || activeTab === "팔래요") && (
          <section>
            <h2 className="text-lg font-semibold mb-3 text-black">팔고싶어요</h2>
            <div className="space-y-3">
              {sellItems.length > 0 ? (
                sellItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100"
                  >
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                        {item.image}
                      </div>
                      <div className="flex-1 min-w-0">
                        {/*줄바꿈 -> 그라데이션 효과 적용*/}
                        <div className="relative overflow-hidden">
                          <h3 className="font-medium text-gray-900 text-sm whitespace-nowrap">{item.title}</h3>
                          <div className="absolute top-0 right-0 w-8 h-full bg-gradient-to-l from-white"></div>
                        </div>
                        <p className="text-sm text-gray-600 mt-0.5">{item.price}</p>
                      </div>
                    </div>
                    {getStatusButton(item.status)}
                  </div>
                ))
              ) : (
                <div className="text-center p-8 text-gray-600 bg-gray-100 rounded-xl border border-gray-100">
                  <p className="text-sm font-semibold">아직 거래한게 없어요</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* 살래요 Section */}
        {(activeTab === "전체" || activeTab === "살래요") && (
          <section>
            <h2 className="text-lg font-semibold mb-3 text-black">사고싶어요</h2>
            <div className="space-y-3">
              {buyItems.length > 0 ? (
                buyItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100"
                  >
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                        {item.image}
                      </div>
                      <div className="flex-1 min-w-0 ">
                        <div className="relative overflow-hidden">
                          <h3 className="font-medium text-gray-900 text-sm whitespace-nowrap">{item.title}</h3>
                          <div className="absolute top-0 right-0 w-8 h-full bg-gradient-to-l from-white"></div>
                        </div>
                        <p className="text-sm text-gray-600 mt-0.5">{item.price}</p>
                      </div>
                    </div>
                    {getStatusButton(item.status)}
                  </div>
                ))
              ) : (
                <div className="text-center p-8 text-gray-600 bg-gray-100 rounded-xl border border-gray-100">
                  <p className="text-sm font-semibold">아직 거래한게 없어요</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* 모여요 Section */}
        {(activeTab === "전체" || activeTab === "모여요") && (
          <section>
            <h2 className="text-lg font-semibold mb-3 text-black">모여요</h2>
            <div className="space-y-3">
              {gatheringsItems.length > 0 ? (
                gatheringsItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100"
                  >
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                        {item.image}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="relative overflow-hidden">
                          <h3 className="font-medium text-gray-900 text-sm whitespace-nowrap">{item.title}</h3>
                          <div className="absolute top-0 right-0 w-8 h-full bg-gradient-to-l from-white"></div>
                        </div>
                        <p className="text-sm text-gray-600 mt-0.5">{item.price}</p>
                      </div>
                    </div>
                    {getStatusButton(item.status)}
                  </div>
                ))
              ) : (
                <div className="text-center p-8 text-gray-600 bg-gray-100 rounded-xl border border-gray-100">
                  <p className="text-sm font-semibold">아직 거래한게 없어요</p>
                </div>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
