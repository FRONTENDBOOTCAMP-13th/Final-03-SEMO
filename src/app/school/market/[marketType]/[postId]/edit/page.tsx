// 게시글 수정 페이지

"use client";
import { useState } from "react";

export default function EditPage() {
  const [selected, setSelected] = useState<"registered" | "new">("registered");
  const [tradeType, setTradeType] = useState<"sell" | "buy" | "group">("sell");

  return (
    <main className="min-w-[320px] max-w-[480px] mx-auto px-4 py-6 min-h-screen bg-uni-white">
      <div role="form" aria-label="상품 등록 폼">
        <section>
          <h1 className="sr-only">상품 등록</h1>
          <div className="mb-5">
            <label htmlFor="item-name" className="sr-only">
              상품명
            </label>
            <input
              id="item-name"
              type="text"
              placeholder="상품명"
              className="w-full bg-uni-gray-200 rounded-md p-3 text-16"
            />
          </div>
          <div className="mb-5">
            <input
              id="item-image"
              type="text"
              placeholder="사진 추가"
              className="w-full bg-uni-gray-200 rounded-md p-3 text-16"
            />
          </div>
        </section>
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
        <section className="mb-5">
          <div className="mb-5">
            <label htmlFor="category" className="sr-only">
              카테고리
            </label>
            {/* 카테고리 셀렉트 */}
            <select className="w-full bg-uni-gray-200 rounded-lg p-3 text-16 text-uni-gray-600">
              <option value="">카테고리</option>
              <option value="음식">음식</option>
              <option value="서적">서적</option>
              <option value="생활용품">생활용품</option>
              <option value="학용품">학용품</option>
            </select>
          </div>
          <div className="mb-5">
            <label htmlFor="desc" className="sr-only">
              상품 설명
            </label>
            <textarea
              id="desc"
              placeholder="상품 설명"
              className="w-full h-[150px] bg-uni-gray-200 rounded-md p-3 text-16"
              maxLength={250}
            />
          </div>
          <div className="mb-5">
            <label htmlFor="price" className="sr-only">
              가격
            </label>
            <input
              id="price"
              type="text"
              placeholder="가격"
              className="w-full bg-uni-gray-200 rounded-md p-3 text-16"
            />
          </div>
          <div className="mb-5">
            <label htmlFor="location" className="sr-only">
              가격
            </label>
            <input type="text" placeholder="거래 장소" className="w-full bg-uni-gray-200 rounded-md p-3 text-16" />
          </div>
        </section>

        {/* 공동구매 추가 폼, 클릭시만 보이게*/}
        {tradeType === "group" && (
          <section className="mb-8">
            <div className="mb-5">
              <label htmlFor="participants" className="sr-only">
                인원수
              </label>
              <div className="relative">
                <input
                  type="number"
                  placeholder="인원"
                  className="w-full bg-uni-gray-200 rounded-md p-3 text-16"
                  min="1"
                />
                <p className="text-14 text-uni-gray-600 mt-2">총금액을 나눠서 결제할 인원수를 입력해주세요</p>
              </div>
            </div>
            <div className="mb-5">
              <label htmlFor="location" className="sr-only">
                분배 장소
              </label>
              <input type="text" placeholder="분배 장소" className="w-full bg-uni-gray-200 rounded-md p-3 text-16" />
              <p className="text-14 text-uni-gray-600 mt-2">분배할 장소를 입력해주세요</p>
            </div>
            <div className="mb-8">
              <label htmlFor="deadline" className="sr-only">
                마감시간
              </label>
              <div className="relaltive">
                <input id="deadline" type="datetime-local" className="w-full bg-uni-gray-200 rounded-md p-3 text-16" />
                <p className="text-14 text-uni-gray-600 mt-2">마감시간을 설정해주세요</p>
              </div>
            </div>
          </section>
        )}
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
            <div>
              <select className="w-full bg-uni-gray-200 rounded-lg p-3 mb-5 text-16 text-uni-gray-600">
                <option value="">은행사</option>
                <option value="카카오뱅크">카카오뱅크</option>
                <option value="우리은행">우리은행</option>
                <option value="농협">농협</option>
                <option value="기업은행">기업은행</option>
              </select>
              <input
                type="text"
                placeholder="계좌번호"
                className="w-full bg-uni-gray-200 rounded-md p-3 mb-8 text-16"
              />
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
