"use client";
// 게시글 작성 페이지
import { useState } from "react";
import GroupPurchase from "./GroupPurchase";
import ProductDesc from "./ProductDesc";
import Product from "./Product";
import NewAccount from "./NewAccount";

export default function MarketNew() {
  const [selected, setSelected] = useState<"registered" | "new">("registered");
  const [tradeType, setTradeType] = useState<"sell" | "buy" | "group">("sell");

  return (
    <main className="min-w-[320px] max-w-[480px] mx-auto px-4 py-6 min-h-screen bg-uni-white">
      <div role="form" aria-label="상품 등록 폼">
        {/* 상품 */}
        <Product />
        <section className="mb-5">
          <h2 className="sr-only">거래 유형</h2>
          <div className="flex gap-3" role="group" aria-label="거래 유형 선택">
            <button
              type="button"
              onClick={() => setTradeType("sell")}
              className="px-4 py-2 rounded-lg bg-yellow-100 text-black font-medium text-14 cursor-pointer"
            >
              팔래요
            </button>
            <button
              type="button"
              onClick={() => setTradeType("buy")}
              className="px-4 py-2 rounded-lg bg-uni-red-200 text-black font-medium text-14 cursor-pointer"
            >
              살래요
            </button>
            <button
              type="button"
              onClick={() => setTradeType("group")}
              className="px-4 py-2 rounded-lg bg-uni-blue-200 text-black font-medium text-14 cursor-pointer"
            >
              모여요
            </button>
          </div>
        </section>
        {/* 상품 설명 */}
        <ProductDesc />
        {/* 공동구매 추가 폼, 클릭시만 보이게*/}
        {tradeType === "group" && <GroupPurchase />}
        <section className="mb-8">
          <h2 className="sr-only">계좌 정보</h2>
          <fieldset>
            <legend className="sr-only">계좌 번호 선택</legend>
            {/* 라디오 버튼 */}
            <label
              htmlFor="account-registered"
              className={`flex justify-between items-center p-3 mb-3 rounded-lg border ${selected === "registered" ? "border-uni-blue-500" : "border-uni-gray-200"}`}
            >
              <span className="ml-2 text-14 font-medium">등록된 계좌 번호</span>
              <input
                id="account-registered"
                type="radio"
                name="account"
                value="registered"
                checked={selected === "registered"}
                onChange={() => setSelected("registered")}
                className=""
              />
            </label>
            <label
              htmlFor="account-new"
              className={`flex justify-between items-center p-3 mt-3 mb-8 rounded-lg border ${selected === "new" ? "border-uni-blue-500" : "border-uni-gray-200"}`}
            >
              <span className="ml-2 text-14 font-medium">새로운 계좌 번호</span>
              <input
                id="account-new"
                type="radio"
                name="account"
                value="new"
                checked={selected === "new"}
                onChange={() => setSelected("new")}
                className=""
              />
            </label>
          </fieldset>
          {/* 새로운 계좌 입력 */}
          {selected === "new" && (
            // 새로운 계좌
            <NewAccount />
          )}
        </section>
      </div>
    </main>
  );
}
