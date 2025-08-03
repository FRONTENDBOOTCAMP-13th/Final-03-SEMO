import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "로그아웃 성공" });
  response.cookies.set("token", "", {
    path: "/",
    expires: new Date(0),
  });
  return response;
}
