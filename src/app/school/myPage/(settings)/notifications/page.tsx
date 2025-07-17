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

  return (
    <div className="px-4 py-6">
      {/* 채팅 Section */}
      <div className="mb-8">
        <h2 className="text-18 font-semibold mb-4 text-uni-black font-pretendard">채팅</h2>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-uni-black text-16 font-pretendard">메시지 알림</div>
            <div className="text-14 text-uni-blue-600 font-pretendard">새 메시지 알림 받기</div>
          </div>
          <ToggleSwitch isOn={notifications.messageAlert} onToggle={() => handleToggle("messageAlert")} />
        </div>
      </div>

      {/* 게시물 Section */}
      <div className="mb-8">
        <h2 className="text-18 font-semibold mb-4 text-uni-black font-pretendard">게시물</h2>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-uni-black text-16 font-pretendard">찜 알림</div>
              <div className="text-14 text-uni-blue-600 font-pretendard">게시물 찜 알림 받기</div>
            </div>
            <ToggleSwitch isOn={notifications.postLikeAlert} onToggle={() => handleToggle("postLikeAlert")} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-uni-black text-16 font-pretendard">댓글 알림</div>
              <div className="text-14 text-uni-blue-600 font-pretendard">게시물 댓글 알림 받기</div>
            </div>
            <ToggleSwitch isOn={notifications.postCommentAlert} onToggle={() => handleToggle("postCommentAlert")} />
          </div>
        </div>
      </div>

      {/* 공동구매 Section */}
      <div className="mb-12">
        <h2 className="text-18 font-semibold mb-4 text-uni-black font-pretendard">공동구매</h2>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-uni-black text-16 font-pretendard">참여 확정 알림</div>
              <div className="text-14 text-uni-blue-600 font-pretendard">참여 확정 알림 받기</div>
            </div>
            <ToggleSwitch
              isOn={notifications.participationConfirmationAlert}
              onToggle={() => handleToggle("participationConfirmationAlert")}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-uni-black text-16 font-pretendard">모집 완료 알림</div>
              <div className="text-14 text-uni-blue-600 font-pretendard">모집 완료 알림 받기</div>
            </div>
            <ToggleSwitch
              isOn={notifications.recruitmentCompletionAlert}
              onToggle={() => handleToggle("recruitmentCompletionAlert")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
