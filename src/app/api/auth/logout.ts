import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    // 쿠키 세션 제거 또는 토큰 무효화
    res.setHeader("Set-Cookie", "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT");
    res.status(200).json({ message: "로그아웃 성공" });
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
