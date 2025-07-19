"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import GroupPurchase from "./_components/GroupPurchase";
import ProductDesc from "./_components/ProductDesc";
import Product from "./_components/Product";
import NewAccount from "./_components/NewAccount";

interface Props {
  boardType: string;
}

export default function RegisterForm({ boardType }: Props) {
  const router = useRouter();
  const [selected, setSelected] = useState<"registered" | "new">("registered");
  const [tradeType, setTradeType] = useState<"sell" | "buy" | "group">("sell"); // 거래 유형 상태
  const [images, setImages] = useState<string[]>([]); // 업로드된 이미지 저장 (Data URL 배열)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget); // 폼의 모든 입력값들을 FormData 객체로 수집
    try {
      const imageData = images.length > 0 ? images[0] : "";
      // 서버로 보낼 데이터
      const payload = {
        type: tradeType,
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

      // 사용자가 선택한 타입에 맞는 페이지로 이동
      const redirectType = tradeType;
      router.push(`/school/market/${redirectType}`);
    } catch (error) {
      console.error("Error submitting form:", error);
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
      case "group":
        return "bg-uni-blue-200 text-uni-black";
      default:
        return "border-2 border-uni-gray-200 text-uni-gray-400";
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <input type="hidden" name="type" value={boardType} />

      <main className="min-w-[320px] max-w-[480px] mx-auto px-4 py-6 min-h-screen bg-uni-white">
        <Product images={images} setImages={setImages} />
        <section role="group" aria-label="거래 유형" className="mb-5 flex gap-3">
          {/* 팔래요, 살래요, 모여요 버튼 생성 */}
          {(["sell", "buy", "group"] as const).map((t) => (
            <label
              key={t}
              className={`flex items-center justify-center px-5 py-2 rounded-xl font-medium text-14 cursor-pointer ${getButtonStyle(t, tradeType)} }`}
            >
              <input
                type="radio"
                name="tradeType"
                value={t}
                checked={tradeType === t}
                onChange={() => setTradeType(t)} // 버튼 클릭시 tradeType 상태 업데이트
                className="hidden"
              />
              {t === "sell" ? "팔래요" : t === "buy" ? "살래요" : "모여요"}
            </label>
          ))}
        </section>

        <ProductDesc />
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
            등록하기
          </button>
        </div>
      </main>
    </form>
  );
}
