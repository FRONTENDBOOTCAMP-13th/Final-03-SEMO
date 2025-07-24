/**
 * @fileoverview 전역 소켓 관리 컴포넌트
 *
 * @description
 * 사용자 로그인 상태를 감지하여 자동으로 소켓 연결 및 글로벌룸 입장을 처리합니다.
 * 로그인/로그아웃 시 소켓 연결/해제를 자동으로 관리합니다.
 */

"use client";

import { useEffect } from "react";
import { useUserStore } from "@/store/userStore";
import { useChatSocket } from "@/app/api/chat/useChatSoket";

interface GlobalSocketManagerProps {
  isAuthPage: boolean;
}

export default function GlobalSocketManager({ isAuthPage }: GlobalSocketManagerProps) {
  const { user } = useUserStore();

  // 로그인 상태 확인 (user._id와 user.name이 있으면 로그인된 것으로 간주)
  const isLoggedIn = user._id && user.name;

  // 소켓 연결 조건: 로그인되어 있고 + 인증 페이지가 아닐 때
  const shouldConnectSocket = isLoggedIn && !isAuthPage;

  // React Hooks 규칙: 항상 같은 순서로 훅을 호출해야 함
  // 로그인되고 인증페이지가 아닐 때만 유효한 데이터 전달
  useChatSocket({
    userId: shouldConnectSocket && user._id ? String(user._id) : "",
    nickName: shouldConnectSocket && user.name ? user.name : "",
    roomId: "global",
  });

  useEffect(() => {
    if (shouldConnectSocket) {
      console.log("🔌 글로벌 소켓 연결 시작:", {
        userId: user._id,
        nickName: user.name,
        isAuthPage,
      });
    } else {
      console.log("❌ 소켓 연결 조건 미충족:", {
        isLoggedIn,
        isAuthPage,
        userId: user._id,
      });
    }
  }, [shouldConnectSocket, isLoggedIn, user._id, user.name, isAuthPage]);

  // 이 컴포넌트는 UI를 렌더링하지 않고 소켓 연결만 관리
  return null;
}
