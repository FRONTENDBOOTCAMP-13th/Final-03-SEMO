import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { useUserStore } from "@/store/userStore";

const SKIP_PATHS = ["/signup", "/signup/password", "/signup/complete", "/signup/code"];

export const useAuthGuard = (requireLogin = true) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useUserStore();

  const isLoggedIn = !!user && (!!user._id || !!user.extra?.providerAccountId) && !!user.name;

  useEffect(() => {
    // 훅은 무조건 호출된 뒤에 그 안에서 분기
    if (SKIP_PATHS.some((p) => pathname.startsWith(p))) {
      return;
    }

    if (requireLogin && !isLoggedIn) {
      router.replace("/login");
    } else if (!requireLogin && isLoggedIn) {
      router.replace("/school/home");
    }
  }, [requireLogin, isLoggedIn, pathname, router]);
};
