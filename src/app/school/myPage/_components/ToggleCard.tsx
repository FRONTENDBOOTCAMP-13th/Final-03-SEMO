// app/setting/_components/NotificationToggleItem.tsx
"use client";

import React from "react";

type NotificationToggleItemProps = {
  title: string;
  description: string;
  isOn: boolean;
  onToggle: () => void;
};

export default function NotificationToggleItem({ title, description, isOn, onToggle }: NotificationToggleItemProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="text-uni-black text-16 font-pretendard">{title}</div>
        <div className="text-14 text-uni-blue-600 font-pretendard">{description}</div>
      </div>
      <div
        className={`relative w-12 h-6 rounded-full cursor-pointer transition-colors ${
          isOn ? "bg-uni-blue-400" : "bg-uni-gray-200"
        }`}
        onClick={onToggle}
      >
        <div
          className={`absolute top-0.5 w-5 h-5 bg-uni-white rounded-full shadow-md transition-transform ${
            isOn ? "translate-x-6" : "translate-x-0.5"
          }`}
        />
      </div>
    </div>
  );
}
