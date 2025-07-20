/**
 * TabNavigation 컴포넌트
 *
 * 상단 탭 메뉴 컴포넌트입니다.
 *
 * @example
 * const [activeTab, setActiveTab] = useState("전체");
 *
 * <TabNavigation
 *   tabs={["전체", "팔래요", "살래요", "모여요"]}
 *   activeTab={activeTab}
 *   setActiveTab={setActiveTab}
 * />
 *
 * @param tabs - 탭 이름 배열(2개를 보내도 자동으로 정렬 됩니다)
 * @param activeTab - 현재 선택된 탭 이름
 * @param setActiveTab - 탭을 변경할 때 호출할 함수
 */

"use client";

interface TabNavigationProps {
  tabs: string[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function TabNavigation({ tabs, activeTab, setActiveTab }: TabNavigationProps) {
  return (
    <nav className="flex bg-uni-white border-b border-uni-gray-100">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`flex-1 py-4 px-4 text-14 font-medium font-pretendard border-b-2 transition-colors ${
            activeTab === tab
              ? "text-uni-blue-400 border-uni-blue-400"
              : "text-uni-gray-300 border-transparent hover:text-uni-gray-400"
          }`}
        >
          {tab}
        </button>
      ))}
    </nav>
  );
}
