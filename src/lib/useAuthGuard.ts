import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUserStore } from "@/store/userStore";

export const useAuthGuard = (requireLogin = true) => {
  const router = useRouter();
  const { user } = useUserStore();

  useEffect(() => {
    if (requireLogin && !user) {
      router.replace("/login");
    } else if (!requireLogin && user) {
      router.replace("/school");
    }
  }, [user, requireLogin, router]);
};
