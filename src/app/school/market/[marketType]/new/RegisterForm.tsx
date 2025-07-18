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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const payload = {
      type: boardType,
      title: formData.get("title"),
      content: formData.get("content"),
      image: formData.get("image"),
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
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="hidden" name="type" value={boardType} />

      <main className="min-w-[320px] max-w-[480px] mx-auto px-4 py-6 min-h-screen bg-uni-white">
        <Product />

        <section role="group" aria-label="거래 유형" className="mb-5">
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
        </section>

        <ProductDesc />
        {tradeType === "group" && <GroupPurchase />}

        <section className="mb-8">
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
        </section>

        <div className="flex justify-end">
          <button type="submit" className="bg-orange-500 text-white px-4 py-2 rounded">
            등록
          </button>
        </div>
      </main>
    </form>
  );
}
