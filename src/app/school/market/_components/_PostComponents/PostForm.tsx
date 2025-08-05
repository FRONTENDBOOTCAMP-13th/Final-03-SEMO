// 게시글 공용 폼 컴포넌트
"use client";

import { useState, useActionState, useEffect } from "react";
import { createPost, updatePost } from "@/data/actions/post";
import { useUserStore } from "@/store/userStore";
import { Post, PostType } from "@/types";
import GroupPurchase from "./GroupPurchaseForm";
import ProductDesc from "./ProductDesc";
import Product from "./Product";
import NewAccount from "./NewAccount";

interface PostFormProps {
  mode: "create" | "edit";
  initialData?: Post; // 수정 모드에서 기존 게시글 데이터
  marketType: PostType; // 게시판 타입
  postId?: string; // 수정 모드에서 게시글 ID
}

export default function PostForm({ mode, initialData, marketType, postId }: PostFormProps) {
  const [selected, setSelected] = useState<"registered" | "new">("registered"); // 계좌 유형 선택 상태 관리
  const [tradeType, setTradeType] = useState<"sell" | "buy" | "groupPurchase">( // 거래 유형 상태 관리
    (initialData?.type as "sell" | "buy" | "groupPurchase") ||
      (marketType as "sell" | "buy" | "groupPurchase") ||
      "sell"
  );
  const [images, setImages] = useState<string[]>(initialData?.image ? [initialData.image] : []); // 이미지 배열(초기값 : 이미지 한장만 가능하게 설정, 추후 변경)
  const [contentError, setContentError] = useState<string>(""); // 상품 설명 에러 메시지
  const [titleError, setTitleError] = useState<string>(""); // 제목 에러 메시지
  const [categoryError, setCategoryError] = useState<string>("");

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

  // 폼 제출 전 검증
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget);
    const content = formData.get("content") as string;
    const title = formData.get("title") as string;
    const category = formData.get("tag") as string; // 카테고리 값 가져오기

    let getError = false;
    // 제목 검증
    if (!title || title.trim().length < 2) {
      setTitleError("상품명은 2글자 이상 입력해주세요.");
      getError = true;
    } else {
      setTitleError(""); // 에러 초기화
    }

    // 상품 설명 검증
    if (!content || content.trim().length < 10) {
      setContentError("상품 설명은 10글자 이상 입력해주세요.");
      getError = true;
    } else {
      setContentError(""); // 에러 초기화
    }

    // 카테고리 검증 추가
    if (!category || category.trim() === "") {
      setCategoryError("카테고리를 선택해주세요.");
      getError = true;
    } else {
      setCategoryError(""); // 에러 초기화
    }

    if (getError) {
      e.preventDefault();
    }
  };

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
      case "groupPurchase":
        return "bg-uni-blue-200 text-uni-black";
      default:
        return "border-2 border-uni-gray-200 text-uni-gray-400";
    }
  };

  return (
    <main className="post-form-container min-w-[320px] max-w-[480px] mx-auto px-4 py-6 bg-uni-white">
      <h1 className="sr-only">{mode === "create" ? "새 상품 등록" : "상품 정보 수정"}</h1>
      <form
        action={formAction}
        onSubmit={handleSubmit}
        aria-label={mode === "create" ? "상품 등록 폼" : "상품 수정 폼"}
        noValidate
      >
        <input type="hidden" name="accessToken" value={user?.token?.accessToken ?? ""} />
        <input type="hidden" name="type" value={tradeType} />
        <input type="hidden" name="postId" value={postId} />
        <input type="hidden" name="image" value={images.length > 0 ? images[0] : ""} />

        <section aria-labelledby="product-info-title" className="mb-6">
          <h2 id="product-info-title" className="sr-only">
            상품 기본 정보
          </h2>
          <Product images={images} setImages={setImages} initialTitle={initialData?.title} titleError={titleError} />
        </section>

        <section aria-labelledby="trade-type-title" className="mb-6">
          <p className="text-15 mb-2 text-uni-gray-600 font-bold">거래 방식</p>
          <fieldset role="group" aria-label="거래 유형" className="mb-5 flex gap-3">
            <legend className="sr-only">거래 유형 선택</legend>
            {/* 팔래요, 살래요, 모여요 버튼 생성 */}
            {(["buy", "sell", "groupPurchase"] as const).map((t) => (
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
                {t === "buy" ? "살래요" : t === "sell" ? "팔래요" : "공동구매"}
              </label>
            ))}
          </fieldset>
        </section>

        <section aria-labelledby="product-details-title" className="mb-6">
          <h2 id="product-details-title" className="sr-only">
            상품 상세 정보
          </h2>
          <ProductDesc initialData={initialData} contentError={contentError} categoryError={categoryError} />
        </section>

        {/* 공동구매 전용 세션 */}
        {tradeType === "groupPurchase" && <GroupPurchase initialData={initialData} />}
        <section aria-labelledby="group-purchase-title" className="mb-8">
          <fieldset className="flex flex-col gap-3">
            <label
              className={`flex justify-between items-center p-4 rounded-lg cursor-pointer
        ${selected === "registered" ? "border-2 border-uni-blue-400" : "border-2 border-uni-gray-200"}`}
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
              className={`flex justify-between items-center mb-5 p-4 rounded-lg cursor-pointer
        ${selected === "new" ? "border-2 border-uni-blue-400" : "border-2 border-uni-gray-200"}`}
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

        {/* 제출 버튼 */}
        <section className="flex justify-end">
          <button
            type="submit"
            className="w-full bg-uni-blue-400 text-uni-white py-3 font-semibold rounded-lg cursor-pointer"
            aria-label={mode === "create" ? "상품 등록하기" : "상품 수정하기"}
          >
            {mode === "create" ? "등록하기" : "수정하기"}
          </button>
        </section>
      </form>
    </main>
  );
}
