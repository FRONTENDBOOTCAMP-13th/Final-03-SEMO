import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types/user";

interface UserStore {
  user: Partial<User>;
  setUser: (user: Partial<User>) => void;
  resetUser: () => void;

  verificationCode: string;
  setVerificationCode: (code: string) => void;

  // 이메일 인증용 (카카오 유저 흐름)
  emailForVerification: string;
  setEmailForVerification: (email: string) => void;

  emailVerified: boolean; // 인증 완료 플래그
  setEmailVerified: (v: boolean) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: {},
      verificationCode: "",
      emailVerified: false,
      emailForVerification: "",

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
        set({
          user: {},
          verificationCode: "",
          emailForVerification: "",
          emailVerified: false,
        });
      },

      setEmailVerified: (v) => set({ emailVerified: v }),
      setEmailForVerification: (email) => set({ emailForVerification: email }),
      setVerificationCode: (code) => set({ verificationCode: code }),
    }),

    {
      name: "user-storage",
      partialize: (state) => ({
        user: state.user,
        verificationCode: state.verificationCode,
        emailForVerification: state.emailForVerification,
      }), // 불필요한 state 저장 방지
    }
  )
);
