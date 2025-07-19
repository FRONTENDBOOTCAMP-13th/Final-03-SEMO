"use client";

import { useEffect, useState } from "react";

export default function ApiTest() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts?type=buy`, {
      headers: {
        "client-Id": process.env.NEXT_PUBLIC_CLIENT_ID!,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => {
        console.log("응답 확인:", json);
        setData(json);
      })
      .catch((err) => {
        console.error("에러 발생:", err);
      });
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">API 호출 테스트 (type=buy)</h1>
      <pre className="whitespace-pre-wrap break-all">{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
