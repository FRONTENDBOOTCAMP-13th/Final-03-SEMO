"use client";

import { useSetPageHeader } from "@/contexts/PageHeaderContext";
import { useCallback, useMemo, useState, useEffect, startTransition } from "react";
import { useUserStore } from "@/store/userStore";
import { usePathname, useRouter } from "next/navigation";
import { useActionState } from "react";
import { deletePost } from "@/data/actions/post";
import { Trash2, PenLine, ExternalLink } from "lucide-react";

const HEADER_CONFIGS = {
  marketList: {
    title: "상품",
    backLink: "/school/home",
    showMeatball: false,
  },
  marketNew: {
    title: "상품 등록",
    backLink: "",
    showMeatball: false,
  },
  marketEdit: {
    title: "상품 수정",
    backLink: "",
    showMeatball: false,
  },
  marketSearch: {
    title: "상품 검색",
    backLink: "",
    showMeatball: false,
  },
  marketDetail: {
    title: "상품 상세",
    backLink: "",
    showMeatball: true,
  },
  // 공동구매 세팅
  groupList: {
    title: "공동구매",
    backLink: "/school/home",
    showMeatball: false,
  },
  groupNew: {
    title: "공동구매 등록",
    backLink: "",
    showMeatball: false,
  },
  groupEdit: {
    title: "공동구매 수정",
    backLink: "",
    showMeatball: false,
  },
  groupSearch: {
    title: "공동구매 검색",
    backLink: "",
    showMeatball: false,
  },
  groupDetail: {
    title: "공동구매 상세",
    backLink: "",
    showMeatball: true,
  },
};

export default function MarketPageHeader() {
  const pathname = usePathname(); // 현재 페이지 경로 확인
  const router = useRouter(); // 페이지 이동
  const [showMenu, setShowMenu] = useState(false); // 메뉴 토글 여부 확인
  const [postData, setPostData] = useState<any>(null); // 현재 보고 있는 게시글 데이터 저장
  const [state, formAction, isLoading] = useActionState(deletePost, null);
  // store 토큰 전역 관리
  const { user } = useUserStore();
  console.log(state, isLoading);

  // 삭제 후 성공 처리
  useEffect(() => {
    if (state?.ok === 1) {
      console.log("삭제 성공");
      const postType = postData?.type;

      if (postType === "group") {
        router.push("/school/groupPurchase");
      } else {
        router.push(`/school/market/${postType || "buy"}`);
      }
      setShowMenu(false); // 메뉴 닫기
    }
  }, [state, postData?.type, router]);

  // 게시글 데이터 가져오기 (상세 페이지에서만)
  useEffect(() => {
    const fetchPostData = async () => {
      const pathSegments = pathname.split("/").filter(Boolean);
      let postId = null;

      if (pathname.includes("/market/")) {
        const marketIndex = pathSegments.indexOf("market");
        postId = pathSegments[marketIndex + 2];
      } else if (pathname.includes("/groupPurchase/")) {
        const groupIndex = pathSegments.indexOf("groupPurchase");
        postId = pathSegments[groupIndex + 1];
      }

      // 상세 페이지(postId가 있고 "new"가 아닌 경우)에서 게시글 데이터 가져오기
      if (postId && postId !== "new" && postId !== "search") {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}`, {
            headers: {
              "Client-Id": process.env.NEXT_PUBLIC_CLIENT_ID!,
            },
          });
          const json = await res.json();
          if (json.ok) {
            setPostData(json.item);
          }
        } catch (error) {
          console.error("게시글 데이터 가져오기 실패:", error);
        }
      }
    };

    fetchPostData();
  }, [pathname]);

  const isMyPost = user && postData && user._id === postData.user._id;

  // 메뉴가 열릴 때 스크롤 막기
  useEffect(() => {
    if (showMenu) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    // 스크롤 복원
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showMenu]);

  // 미트볼 클릭시 메뉴 토글
  const handleMeatballClick = useCallback(() => {
    setShowMenu(!showMenu); // 메뉴 토글 추가
  }, [showMenu]);

  // 수정 페이지로 이동
  const handleEdit = () => {
    if (postData) {
      router.push(`/school/market/${postData.type}/${postData._id}/edit`);
      setShowMenu(false); // 메뉴 닫기
    }
  };

  // 삭제 처리
  const handleDelete = async () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) {
      return;
    }

    if (postData && user?.token?.accessToken) {
      try {
        const formData = new FormData();
        formData.append("accessToken", user?.token?.accessToken);
        formData.append("postId", postData._id.toString());
        formData.append("type", postData.type);

        startTransition(() => {
          formAction(formData);
        });
      } catch (error) {
        console.error("삭제 중 오류:", error);
        alert("삭제 중 오류가 발생했습니다.");
      }
    }
  };

  const headerConfig = useMemo(() => {
    const pathSegments = pathname.split("/").filter(Boolean);
    console.log("=== Debug === 현재 pathname", pathname);
    console.log("=== Debug === pathSegments", pathSegments);

    // 경로 타입 판별
    const MarketPath = pathname.includes("/market/");
    const GroupPath = pathname.includes("/groupPurchase");
    const EditPath = pathname.includes("/edit");

    console.log("=== Debug === MarketPath", MarketPath);
    console.log("=== Debug === GroupPath", GroupPath);

    let config;
    let backLink = "";

    if (MarketPath && !GroupPath) {
      // Market 경로 처리
      const marketIndex = pathSegments.indexOf("market");
      const marketType = pathSegments[marketIndex + 1]; // buy or sell
      const subPage = pathSegments[marketIndex + 2]; // new, search, postId
      const subsubPage = pathSegments[marketIndex + 3]; // edit

      if (subPage === "new") {
        config = HEADER_CONFIGS.marketNew;
      } else if (subPage === "search") {
        config = HEADER_CONFIGS.marketSearch;
      } else if (EditPath || subsubPage === "edit") {
        config = HEADER_CONFIGS.marketEdit;
        backLink = `/school/market/${marketType}/${subPage}`;
      } else if (subPage) {
        config = HEADER_CONFIGS.marketDetail;
      } else {
        config = HEADER_CONFIGS.marketList;
        backLink = "/school/home";
      }

      backLink = subPage ? `/school/market/${marketType}` : "";
    } else if (GroupPath) {
      // GroupPurchase 경로 처리
      const groupIndex = pathSegments.indexOf("groupPurchase");
      const subPage = pathSegments[groupIndex + 1];
      const subsubPage = pathSegments[groupIndex + 2]; // edit
      if (subPage === "new") {
        config = HEADER_CONFIGS.groupNew;
      } else if (subPage === "search") {
        config = HEADER_CONFIGS.groupSearch;
      } else if (EditPath || subsubPage === "edit") {
        config = HEADER_CONFIGS.marketEdit;
        backLink = `/school/market/groupPurchase/${subPage}`;
      } else if (subPage) {
        config = HEADER_CONFIGS.groupDetail;
      } else {
        config = HEADER_CONFIGS.groupList;
      }
      backLink = subPage ? "/school/groupPurchase" : "";
    } else {
      // 기본값 (혹시 모를 경우)
      config = HEADER_CONFIGS.marketList;
    }

    return {
      title: config.title,
      backLink: backLink,
      type: config.showMeatball ? ("meatball" as const) : ("default" as const),
      ...(config.showMeatball && { onMeatballClick: handleMeatballClick }),
    };
  }, [pathname, handleMeatballClick]);
  useSetPageHeader(headerConfig);

  // 메뉴 렌더링
  return showMenu ? (
    <div className="fixed inset-x-0 top-15 bg-uni-white shadow-lg border-b border-uni-gray-200 z-50 min-w-[320px] max-w-[480px] mx-auto px-4 py-3 rounded-b-lg">
      {isMyPost ? (
        // 내 게시글일 때: 수정, 삭제, 공유
        <>
          <button
            onClick={handleEdit}
            className="w-full px-4 py-3 text-left flex justify-between items-center text-uni-black hover:bg-uni-gray-100 !cursor-pointer"
          >
            <span>수정하기</span>
            <PenLine size={20} />
          </button>
          <button
            onClick={handleDelete}
            disabled={isLoading}
            className="w-full px-4 py-3 text-left flex justify-between items-center text-uni-black hover:bg-uni-gray-100 !cursor-pointer"
          >
            <span>삭제하기</span>
            <Trash2 size={20} />
          </button>
          <button
            onClick={() => setShowMenu(false)}
            className="w-full px-4 py-3 text-left flex justify-between items-center text-uni-black hover:bg-uni-gray-100 !cursor-pointer"
          >
            <span>공유하기</span>
            <ExternalLink size={20} />
          </button>
        </>
      ) : (
        // 다른 사람 게시글일 때: 신고, 차단, 공유
        <>
          <button
            onClick={() => setShowMenu(false)}
            className="w-full px-4 py-2 text-left text-uni-gray-600 hover:bg-uni-gray-100"
          >
            신고하기
          </button>
          <button
            onClick={() => setShowMenu(false)}
            className="w-full px-4 py-2 text-left text-uni-gray-600 hover:bg-uni-gray-100"
          >
            차단하기
          </button>
          <button
            onClick={() => setShowMenu(false)}
            className="w-full px-4 py-2 text-left text-uni-black hover:bg-uni-gray-100"
          >
            공유하기
          </button>
        </>
      )}
      <div className="flex justify-center pt-2">
        <div className="w-12 h-1 bg-uni-gray-300 rounded-full"></div>
      </div>
    </div>
  ) : null;
}
