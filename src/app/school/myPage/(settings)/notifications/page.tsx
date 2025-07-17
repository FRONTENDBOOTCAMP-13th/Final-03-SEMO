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

  return <div className="min-h-screen bg-uni-white" />;
}
