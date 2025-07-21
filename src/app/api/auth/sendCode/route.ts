import { NextResponse } from "next/server";
import formData from "form-data";
import Mailgun from "mailgun.js";

export async function POST(req: Request) {
  const { email, code } = await req.json();

  if (!email || !code) {
    return NextResponse.json({ ok: 0, message: "이메일과 코드가 필요합니다." }, { status: 400 });
  }

  const mailgun = new Mailgun(formData);
  const client = mailgun.client({
    username: "api",
    key: process.env.MAILGUN_API_KEY!, // .env에 저장
  });

  try {
    const response = await client.messages.create(process.env.MAILGUN_DOMAIN!, {
      from: "UniStuff <mailgun@sandboxb0ba53a60e1a4252af8860945aa096a3.mailgun.org>", // 도메인에 맞게 수정
      to: [email],
      subject: "UniStuff 인증번호입니다!",
      text: `인증번호는 ${code}입니다.`,
    });

    return NextResponse.json({ ok: 1, result: response });
  } catch (error) {
    return NextResponse.json({ ok: 0, message: "메일 전송 실패", error }, { status: 500 });
  }
}
