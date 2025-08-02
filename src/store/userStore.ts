import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types/user";

interface UserStore {
  user: Partial<User>;
  setUser: (user: Partial<User>) => void;
  resetUser: () => void;

  verificationCode: string;
  setVerificationCode: (code: string) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: {},
      verificationCode: "",
      setVerificationCode: (code) => set({ verificationCode: code }),

      setUser: (user) => {
        console.log("[Zustand] setUser 호출됨:", user);
        if (!user || typeof user !== "object") {
          console.warn("[Zustand] user 데이터 이상함, 저장 취소됨:", user);
          return;
        }

        // 1시간 뒤 로그인 만료 시간 설정
        const expiresAt = Date.now() + 1000 * 60 * 60;

        localStorage.setItem("user-expires-at", expiresAt.toString());
        set({ user });
      },

      resetUser: () => {
        console.log("[Zustand] resetUser 호출됨");
        set({ user: {}, verificationCode: "" });
      },
    }),

    {
      name: "user-storage",
      skipHydration: false,
      partialize: (state) => ({
        user: state.user,
        verificationCode: state.verificationCode,
      }), // 불필요한 state 저장 방지
    }
  )
);
