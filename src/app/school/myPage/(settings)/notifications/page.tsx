"use client";

import React, { useState } from "react";
import Head from "next/head";
import SaveFloatingButton from "@/components/ui/SaveFloatingButton";
import ToggleCard from "@/app/school/myPage/_components/ToggleCard";

export default function NotificationSettings() {
  const [notifications, setNotifications] = useState({
    messageAlert: true,
    postLikeAlert: false,
    postCommentAlert: false,
    participationConfirmationAlert: false,
    recruitmentCompletionAlert: false,
  });

  // 알림 상태 핸들링 로직
  const handleToggle = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleToggleAll = () => {
    const allOn = Object.values(notifications).every((value) => value); //배열 안의 모든 값이 true인지 검사
    setNotifications((prev) => {
      const newState = Object.assign({}, prev);
      for (const key in prev) {
        newState[key as keyof typeof notifications] = !allOn;
      }
      return newState;
    });
  };

  // TODO: 저장 버튼 (현재: 콘솔 로그로 대체)
  const handleSave = () => {};

  return (
    <>
      <Head>
        <title>UniStuff | 알림 설정</title>
        <meta name="description" content="UniStuff의 알림 설정 페이지입니다. 원하는 알림을 켜고 끌 수 있습니다" />
      </Head>
      <div className="px-4 py-6">
      {/* 전체 알림 Section */}
      <div className="mb-8">
        <h2 className="text-18 font-semibold mb-4 text-uni-black font-pretendard">전체 알림</h2>
        <ToggleCard
          title="전체 알림"
          description="모든 알림을 켜거나 끕니다"
          isOn={Object.values(notifications).every((value) => value)}
          onToggle={handleToggleAll}
        />
      </div>

      {/* 채팅 Section */}
      <div className="mb-8">
        <h2 className="text-18 font-semibold mb-4 text-uni-black font-pretendard">채팅</h2>
        <ToggleCard
          title="메시지 알림"
          description="새 메시지 알림 받기"
          isOn={notifications.messageAlert}
          onToggle={() => handleToggle("messageAlert")}
        />
      </div>

      {/* 게시물 Section */}
      <div className="mb-8">
        <h2 className="text-18 font-semibold mb-4 text-uni-black font-pretendard">게시물</h2>
        <div className="space-y-6">
          <ToggleCard
            title="찜 알림"
            description="게시물 찜 알림 받기"
            isOn={notifications.postLikeAlert}
            onToggle={() => handleToggle("postLikeAlert")}
          />
          <ToggleCard
            title="댓글 알림"
            description="게시물 댓글 알림 받기"
            isOn={notifications.postCommentAlert}
            onToggle={() => handleToggle("postCommentAlert")}
          />
        </div>
      </div>

      {/* 공동구매 Section */}
      <div className="mb-12">
        <h2 className="text-18 font-semibold mb-4 text-uni-black font-pretendard">공동구매</h2>
        <div className="space-y-6">
          <ToggleCard
            title="참여 확정 알림"
            description="참여 확정 알림 받기"
            isOn={notifications.participationConfirmationAlert}
            onToggle={() => handleToggle("participationConfirmationAlert")}
          />
          <ToggleCard
            title="모집 완료 알림"
            description="모집 완료 알림 받기"
            isOn={notifications.recruitmentCompletionAlert}
            onToggle={() => handleToggle("recruitmentCompletionAlert")}
          />
        </div>
      </div>
      <SaveFloatingButton onClick={handleSave}>저장하기</SaveFloatingButton>
      </div>
    </>
  );
}
