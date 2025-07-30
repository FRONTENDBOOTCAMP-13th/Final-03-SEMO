import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUserStore } from "@/store/userStore";

export const useAuthGuard = (requireLogin = true) => {
  const router = useRouter();
  const { user } = useUserStore();

  const isLoggedIn = !!user && !!user.name && (!!user._id || !!user.providerAccountId);

  useEffect(() => {
    if (requireLogin && !isLoggedIn) {
      router.replace("/login");
    } else if (!requireLogin && isLoggedIn) {
      router.replace("/school/home");
    }
  }, [isLoggedIn, requireLogin, router]);
};
