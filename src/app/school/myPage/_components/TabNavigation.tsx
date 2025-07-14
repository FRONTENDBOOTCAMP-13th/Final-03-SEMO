"use client";

interface TabNavigationProps {
  tabs: string[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function TabNavigation({ tabs, activeTab, setActiveTab }: TabNavigationProps) {
  return (
    <nav className="flex bg-white border-b border-gray-100">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`flex-1 py-4 px-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === tab ? "text-blue-400 border-blue-400" : "text-gray-500 border-transparent hover:text-gray-700"
          }`}
        >
          {tab}
        </button>
      ))}
    </nav>
  );
}
