import { create } from "zustand";

export interface Message {
  id: string;
  roomId: string;
  content: string;
  type?: "text";
  msgType: "all" | "whisper";
  createdAt: string;
  user_id: string;
  nickName: string;
  isMine?: boolean;

  toUserId?: string;
  toNickName?: string;
}

export interface ChatUser {
  user_id: string;
  nickName: string;
  joinTime?: string;
}

interface ChatStore {
  currentRoomId: string | null;
  messages: Message[];
  setRoomId: (roomId: string) => void;
  addMessage: (msg: Message) => void;
  clearMessages: () => void;
  userList: ChatUser[];
  setUserList: (users: ChatUser[]) => void;
}

// 전역상태 저장소
export const useChatStore = create<ChatStore>((set) => ({
  userList: [],
  setUserList: (users) => set({ userList: users }),
  currentRoomId: null,

  // 채팅 메시지들이 저장
  messages: [],
  // currentRoomId: 채팅방의 ID
  setRoomId: (roomId) => set({ currentRoomId: roomId }),
  // 상태에 있는 messages 배열에 새 메시지 추가 msg는 새로운 메시지
  addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
  // 메시지 클리어
  clearMessages: () => set({ messages: [] }),
}));
