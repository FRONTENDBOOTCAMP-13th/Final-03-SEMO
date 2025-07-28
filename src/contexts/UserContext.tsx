"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import UserService from "@/app/school/myPage/_actions/myPageUserActions";
import { User } from "@/app/school/myPage/_types/user";
import AuthService from "@/lib/authService";

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
      const currentUserId = AuthService.getCurrentUserId();
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
  }, []); // 의존성 배열 비워둠: 컴포넌트 마운트 시 한 번만 생성

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
