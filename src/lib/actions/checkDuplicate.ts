export async function checkEmailDuplicate(email: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/email?email=${encodeURIComponent(email)}`, {
    headers: {
      "Client-Id": process.env.NEXT_PUBLIC_CLIENT_ID ?? "",
    },
  });

  if (res.status === 409) {
    return { ok: false, message: "이미 가입한 이메일입니다." };
  }
  return { ok: true };
}

export async function checkNameDuplicate(name: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/name?name=${encodeURIComponent(name)}`, {
    headers: {
      "Client-Id": process.env.NEXT_PUBLIC_CLIENT_ID ?? "",
    },
  });

  if (res.status === 409) {
    return { ok: false, message: "이미 사용 중인 닉네임입니다." };
  }
  return { ok: true };
}
