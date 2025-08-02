export const findPw = async (email: string): Promise<boolean> => {
  try {
    // 1. 이메일로 유저 정보 조회
    const userRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users?email=${email}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Client-Id": process.env.NEXT_PUBLIC_CLIENT_ID || "",
      },
    });

    const userData = await userRes.json();
    const user = userData.item?.[0];

    if (!user || !user._id) {
      console.error("findPw 해당 이메일로 가입된 유저 없음");
      return false;
    }

    const userId = user._id;

    // 2. 임시 비밀번호 생성
    const tempPw = generateTempPassword();

    // 3. 비밀번호 업데이트
    const patchRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Client-Id": process.env.NEXT_PUBLIC_CLIENT_ID || "",
      },
      body: JSON.stringify({
        password: tempPw,
      }),
    });

    if (!patchRes.ok) throw new Error("비밀번호 변경 실패");

    // 4. 임시 비밀번호 포함된 메일 전송
    const emailRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/email/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Client-Id": process.env.NEXT_PUBLIC_CLIENT_ID || "",
      },
      body: JSON.stringify({
        to: email,
        fromName: "UniStuff",
        subject: "[UniStuff] 임시 비밀번호 안내",
        content: `
          <div style="margin: 0 auto; max-width: 600px; text-align: center;">
            <h2>임시 비밀번호 안내</h2>
            <p>요청하신 계정의 임시 비밀번호는 다음과 같습니다:</p>
            <p style="font-size: 24px; font-weight: bold;">${tempPw}</p>
            <p>로그인 후 반드시 비밀번호를 변경해 주세요.</p>
          </div>
        `,
      }),
    });

    const emailData = await emailRes.json();
    return emailData.ok === 1;
  } catch (err) {
    console.error("findPw 비밀번호 초기화 실패 ", err);
    return false;
  }
};

const generateTempPassword = (): string => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
};
