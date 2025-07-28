// 게시글 공용 폼 컴포넌트
"use client";

import { useState, useActionState, useEffect } from "react";
import { createPost, updatePost } from "@/data/actions/post";
import { useUserStore } from "@/store/userStore";
import { Post } from "@/types";
import GroupPurchase from "./GroupPurchase";
import ProductDesc from "./ProductDesc";
import Product from "./Product";
import NewAccount from "./NewAccount";

interface PostFormProps {
  mode: "create" | "edit";
  initialData?: Post; // 수정 모드에서 기존 게시글 데이터
  marketType: string; // 게시판 타입
  postId?: string; // 수정 모드에서 게시글 ID
}

export default function PostForm({ mode, initialData, marketType, postId }: PostFormProps) {
  const [selected, setSelected] = useState<"registered" | "new">("registered"); // 계좌 유형 선택 상태 관리
  const [tradeType, setTradeType] = useState<"sell" | "buy" | "group">( // 거래 유형 상태 관리
    (initialData?.type as "sell" | "buy" | "group") || (marketType as "sell" | "buy" | "group") || "sell"
  );
  const [images, setImages] = useState<string[]>(initialData?.image ? [initialData.image] : []); // 이미지 배열(초기값 : 이미지 한장만 가능하게 설정, 추후 변경)

  // 서버 액션 사용
  const [state, formAction] = useActionState(mode === "create" ? createPost : updatePost, null);
  // store 토큰 전역 관리
  const { user } = useUserStore();

  // 서버 액션 결과 처리
  useEffect(() => {
    if (state?.ok === 0 && state.message) {
      alert(`오류: ${state.message}`);
    }
  }, [state]);

  const getButtonStyle = (buttonType: string, currentType: string) => {
    // 선택 안된 버튼은 모두 회색
    if (buttonType !== currentType) {
      return "border-2 border-uni-gray-200 text-uni-gray-400";
    }

    // 선택된 버튼은 타입별 색상
    switch (buttonType) {
      case "sell":
        return "bg-yellow-100 text-uni-black";
      case "buy":
        return "bg-uni-red-200 text-uni-black";
      case "group":
        return "bg-uni-blue-200 text-uni-black";
      default:
        return "border-2 border-uni-gray-200 text-uni-gray-400";
    }
  };

  return (
    <form action={formAction}>
      <input type="hidden" name="accessToken" value={user?.token?.accessToken ?? ""} />
      <input type="hidden" name="type" value={tradeType} />
      <input type="hidden" name="postId" value={postId} />
      <input type="hidden" name="image" value={images.length > 0 ? images[0] : ""} />
      <main className="min-w-[320px] max-w-[480px] mx-auto px-4 py-6 min-h-screen bg-uni-white">
        <Product images={images} setImages={setImages} initialTitle={initialData?.title} />
        <section role="group" aria-label="거래 유형" className="mb-5 flex gap-3">
          {/* 팔래요, 살래요, 모여요 버튼 생성 */}
          {(["buy", "sell", "group"] as const).map((t) => (
            <label
              key={t}
              className={`flex items-center justify-center px-5 py-2 rounded-xl font-medium text-14 cursor-pointer ${getButtonStyle(t, tradeType)} }`}
            >
              <input
                type="radio"
                name="tradeTypeInput"
                value={t}
                disabled={mode === "edit"}
                checked={tradeType === t}
                onChange={() => mode === "create" && setTradeType(t)} // 버튼 클릭시 tradeType 상태 업데이트
                className="hidden"
              />
              {t === "buy" ? "살래요" : t === "sell" ? "팔래요" : "모여요"}
            </label>
          ))}
        </section>

        <ProductDesc initialData={initialData} />
        {tradeType === "group" && <GroupPurchase />}
        <section className="mb-8">
          <fieldset className="flex flex-col gap-3">
            <label
              className={`flex justify-between items-center px-4 py-3 rounded-lg cursor-pointer
        ${selected === "registered" ? "border-1 border-uni-blue-400" : "border border-uni-gray-200"}`}
            >
              <span className="text-base text-14">등록된 계좌 번호</span>
              <input
                type="radio"
                name="account"
                value="registered"
                checked={selected === "registered"}
                onChange={() => setSelected("registered")}
                className="accent-uni-blue-500"
              />
            </label>

            <label
              className={`flex justify-between items-center mb-5 px-4 py-3 rounded-lg cursor-pointer
        ${selected === "new" ? "border-1 border-uni-blue-400" : "border border-uni-gray-200"}`}
            >
              <span className="text-base text-14">새로운 계좌 번호</span>
              <input
                type="radio"
                name="account"
                value="new"
                checked={selected === "new"}
                onChange={() => setSelected("new")}
                className="accent-uni-blue-500"
              />
            </label>
          </fieldset>

          {selected === "new" && <NewAccount />}
        </section>

        <div className="flex justify-end">
          <button type="submit" className="w-full bg-uni-blue-400 text-uni-white px-4 py-2 rounded-lg cursor-pointer">
            {mode === "create" ? "등록하기" : "수정하기"}
          </button>
        </div>
      </main>
    </form>
  );
}
