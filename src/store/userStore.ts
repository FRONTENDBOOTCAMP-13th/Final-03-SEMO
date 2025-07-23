import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types/user";

interface UserStore {
  user: Partial<User>; // 모든 속성이 optional
  setUser: (user: Partial<User>) => void;
  resetUser: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: {},
      setUser: (user) => set({ user }),
      resetUser: () => set({ user: {} }),
    }),
    {
      name: "user-storage", // localStorage key
    }
  )
);
