"use client";

import React, { useState } from "react";

export default function NotificationSettings() {
  const [notifications, setNotifications] = useState({
    messageAlert: true,
    postLikeAlert: false,
    postCommentAlert: false,
    participationConfirmationAlert: false,
    recruitmentCompletionAlert: false,
  });

  // ToggleSwitch UI 컴포넌트
  const ToggleSwitch = ({ isOn, onToggle }: { isOn: boolean; onToggle: () => void }) => (
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
  );

  // 알림 상태 핸들링 로직
  const handleToggle = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // TODO: 저장 버튼 (현재: 콘솔 로그로 대체)
  const handleSave = () => {
    console.log("저장된 알림 설정:", {
      메시지알림: notifications.messageAlert,
      찜알림: notifications.postLikeAlert,
      댓글알림: notifications.postCommentAlert,
      참여확정알림: notifications.participationConfirmationAlert,
      모집완료알림: notifications.recruitmentCompletionAlert,
    });
  };

  return <div className="min-h-screen bg-uni-white" />;
}
