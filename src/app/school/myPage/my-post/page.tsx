"use client";

import { useState } from "react";
import TabNavigation from "../_components/TabNavigation";
import ItemCard, { Item } from "../_components/ItemCard";
import EmptyState from "../_components/EmptyState";

export default function MyPageMyPost() {
  const [activeTab, setActiveTab] = useState("전체");

  // 테스트용 더미 데이터
  const sellItems: Item[] = [
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

  const buyItems: Item[] = [
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

  const gatheringsItems: Item[] = [];

  const tabs = ["전체", "팔래요", "살래요", "모여요"];

  return (
    <div className="min-h-screen">
      {/* Tab Navigation */}
      <TabNavigation tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="p-4 space-y-6">
        {/* 팔래요 Section */}
        {(activeTab === "전체" || activeTab === "팔래요") && (
          <section>
            <h2 className="text-lg font-semibold mb-3 text-black">팔고싶어요</h2>
            <div className="space-y-3">
              {sellItems.length > 0 ? (
                sellItems.map((item) => <ItemCard key={item.id} item={item} />)
              ) : (
                <EmptyState message="아직 거래한게 없어요" />
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
                buyItems.map((item) => <ItemCard key={item.id} item={item} />)
              ) : (
                <EmptyState message="아직 거래한게 없어요" />
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
                gatheringsItems.map((item) => <ItemCard key={item.id} item={item} />)
              ) : (
                <EmptyState message="아직 거래한게 없어요" />
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
