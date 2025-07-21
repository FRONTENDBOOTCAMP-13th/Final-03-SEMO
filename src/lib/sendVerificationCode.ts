export async function sendVerificationCode(email: string, code: string) {
  const response = await fetch("/api/auth/sendCode", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, code }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "메일 전송 실패");
  }

  return data;
}
