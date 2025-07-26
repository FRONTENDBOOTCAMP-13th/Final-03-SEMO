"use client";

import { useUserStore } from "@/store/userStore";

export const logout = async () => {
  try {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    useUserStore.getState().resetUser();
  } catch (err) {
    console.error("Logout failed", err);
    throw err;
  }
};
