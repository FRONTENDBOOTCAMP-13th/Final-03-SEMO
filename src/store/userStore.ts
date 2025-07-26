import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types/user";

interface UserStore {
  user: Partial<User>;
  setUser: (user: Partial<User>) => void;
  resetUser: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: {},
      setUser: (user) => {
        console.log("[Zustand] setUser 호출됨:", user);
        // user가 없거나 객체가 아닌 경우 저장하지 않음
        console.log("[Zustand] setUser 호출됨:", user);
        const isValidUser =
          user &&
          typeof user === "object" &&
          (("_id" in user && user._id !== undefined) || ("providerAccountId" in user && user.providerAccountId));

        if (!isValidUser) {
          console.warn("[Zustand] user 데이터 이상함, 저장 취소됨:", user);
          return;
        }

        set({ user });
      },

      resetUser: () => {
        console.log("[Zustand] resetUser 호출됨");
        set({ user: {} });
      },
    }),

    {
      name: "user-storage",
      skipHydration: false,
      partialize: (state) => ({ user: state.user }), // 불필요한 state 저장 방지
    }
  )
);
