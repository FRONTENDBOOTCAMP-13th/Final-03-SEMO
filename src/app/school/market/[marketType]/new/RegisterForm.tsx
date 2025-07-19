"use client";

import { useState } from "react";
import GroupPurchase from "./_components/GroupPurchase";
import ProductDesc from "./_components/ProductDesc";
import Product from "./_components/Product";
import NewAccount from "./_components/NewAccount";

interface Props {
  boardType: string;
}

export default function RegisterForm({ boardType }: Props) {
  const [selected, setSelected] = useState<"registered" | "new">("registered");
  const [tradeType, setTradeType] = useState<"sell" | "buy" | "group">("sell");
  const [images, setImages] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      const imageData = images.length > 0 ? images[0] : "";
      const payload = {
        type: boardType,
        title: formData.get("title"),
        content: formData.get("content"),
        image: imageData,
        extra: {
          category: formData.get("category"),
          price: formData.get("price"),
          location: formData.get("location"),
        },
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Client-Id": process.env.NEXT_PUBLIC_CLIENT_ID!,
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      console.log(json);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <input type="hidden" name="type" value={boardType} />

      <main className="min-w-[320px] max-w-[480px] mx-auto px-4 py-6 min-h-screen bg-uni-white">
        <Product images={images} setImages={setImages} />

        {/* <section role="group" aria-label="거래 유형" className="mb-5">
          {(["sell", "buy", "group"] as const).map((t) => (
            <label key={t} className="mr-2">
              <input
                type="radio"
                name="tradeType"
                value={t}
                checked={tradeType === t}
                onChange={() => setTradeType(t)}
              />
              {t === "sell" ? "팔래요" : t === "buy" ? "살래요" : "모여요"}
            </label>
          ))}
        </section> */}
        <section role="group" aria-label="거래 유형" className="mb-5 flex gap-3">
          {(["sell", "buy", "group"] as const).map((t) => (
            <label
              key={t}
              className={`
        flex items-center justify-center px-5 py-2 rounded-xl font-medium text-14 cursor-pointer
        ${
          tradeType === t
            ? t === "sell"
              ? "bg-yellow-100 text-uni-black"
              : t === "buy"
                ? "bg-uni-red-200 text-uni-black"
                : "bg-uni-blue-200 text-uni-black"
            : t === "sell"
              ? "border-2 border-uni-gray-200 text-uni-gray-400"
              : t === "buy"
                ? "border-2 border-uni-gray-200 text-uni-gray-400"
                : "border-2 border-uni-gray-200 text-uni-gray-400"
        }
      `}
            >
              <input
                type="radio"
                name="tradeType"
                value={t}
                checked={tradeType === t}
                onChange={() => setTradeType(t)}
                className="hidden"
              />
              {t === "sell" ? "팔래요" : t === "buy" ? "살래요" : "모여요"}
            </label>
          ))}
        </section>

        <ProductDesc />
        {tradeType === "group" && <GroupPurchase />}

        {/* <section className="mb-8">
          <fieldset>
            <legend>계좌 정보</legend>
            <label className="block">
              <input
                type="radio"
                name="account"
                value="registered"
                checked={selected === "registered"}
                onChange={() => setSelected("registered")}
              />
              등록된 계좌
            </label>
            <label className="block mt-2">
              <input
                type="radio"
                name="account"
                value="new"
                checked={selected === "new"}
                onChange={() => setSelected("new")}
              />
              새로운 계좌
            </label>
          </fieldset>
          {selected === "new" && <NewAccount />}
        </section> */}
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
            등록하기
          </button>
        </div>
      </main>
    </form>
  );
}
