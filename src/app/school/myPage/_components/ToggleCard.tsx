/**
 * ToggleCard 컴포넌트
 *
 * 알림 설정 항목을 보여주는 토글 스위치 컴포넌트입니다.
 * 제목과 설명 텍스트를 표시하며, 스위치 클릭 시 토글 상태를 변경합니다.
 *
 * @example
 * <NotificationToggleItem
 *   title="이메일 알림"
 *   description="이메일로 알림을 받습니다."
 *   isOn={isEmailOn}
 *   onToggle={handleEmailToggle}
 * />
 *
 * @param title - 알림 항목 제목 텍스트
 * @param description - 알림 항목 설명 텍스트
 * @param isOn - 토글 스위치 활성화 여부 (true: 켜짐)
 * @param onToggle - 토글 스위치 클릭 시 호출되는 함수
 */

"use client";

import React from "react";

type ToggleCardProps = {
  title: string;
  description: string;
  isOn: boolean;
  onToggle: () => void;
};

export default function ToggleCard({ title, description, isOn, onToggle }: ToggleCardProps) {
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
