"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import UserService from "@/app/school/myPage/_actions/myPageUserActions";
import { User } from "@/app/school/myPage/_types/user";
import { useUserStore } from "@/store/userStore"; // useUserStore 임포트

interface UserContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const currentUserId = useUserStore.getState().user?._id; // Zustand 스토어에서 사용자 ID 가져오기
      if (currentUserId) {
        const fetchedUser = await UserService.getUserById(currentUserId);
        setUser(fetchedUser);
      } else {
        setUser(null);
        setError("사용자 ID를 찾을 수 없습니다.");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "사용자 정보를 불러오는 데 실패했습니다.";
      setError(errorMessage);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]); // fetchUser가 변경될 때마다 실행 (useCallback으로 안정화)

  const refreshUser = useCallback(async () => {
    await fetchUser();
  }, [fetchUser]);

  return <UserContext.Provider value={{ user, loading, error, refreshUser }}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
