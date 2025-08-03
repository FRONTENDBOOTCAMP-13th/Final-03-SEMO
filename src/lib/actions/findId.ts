export const findId = async (university: string, studentId: string): Promise<string | null> => {
  try {
    const custom = encodeURIComponent(
      JSON.stringify({
        "extra.university": university,
        "extra.studentId": studentId,
      })
    );

    const url = `${process.env.NEXT_PUBLIC_API_URL}/users?custom=${custom}`;
    console.log("findId 요청 URL:", url);

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Client-Id": process.env.NEXT_PUBLIC_CLIENT_ID ?? "",
      },
    });

    const data = await res.json();
    console.log("findId 응답 데이터:", data);

    if (!res.ok) {
      console.warn("findId 응답 실패", res.status);
      return null;
    }
    const user = data.item?.[0]; // 첫 번째 유저만

    return user?.email ?? null;
  } catch (err) {
    console.error("아이디(이메일) 찾기 에러:", err);
    return null;
  }
};
