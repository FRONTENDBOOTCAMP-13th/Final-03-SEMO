export const sendVerificationCode = async (email: string, code: string): Promise<void> => {
  if (!email) {
    throw new Error("이메일이 없습니다.");
  }

  const content = `
    <div style="margin: 0 auto; max-width: 600px; text-align: center;">
      <h2>[UniStuff] 회원가입 인증번호</h2>
      <p>아래 인증번호를 입력해 주세요:</p>
      <p style="font-size: 24px; font-weight: bold;">${code}</p>
      <p>※ 인증번호는 5분간 유효합니다.</p>
    </div>
  `;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/email/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Client-Id": process.env.NEXT_PUBLIC_CLIENT_ID || "",
    },
    body: JSON.stringify({
      to: email,
      serviceName: "UniStuff",
      subject: "[UniStuff] 회원가입 인증번호 안내",
      content,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    console.error("메일 전송 실패 응답:", err);
    throw new Error(err.message || "인증번호 이메일 전송 실패");
  }
};
