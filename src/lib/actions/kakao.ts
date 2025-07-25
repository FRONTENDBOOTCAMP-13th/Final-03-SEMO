// "use server";

// import { User } from "@/types/user";

// const KAKAO_API_URL = "https://kapi.kakao.com/v2/user/me";
// const KAKAO_TOKEN_URL = "https://kauth.kakao.com/oauth/token";
// const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL!;
// const CLIENT_ID = process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY!;
// const REDIRECT_URI = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI!;
// const CLIENT_SECRET = process.env.NEXT_PUBLIC_KAKAO_CLIENT_SECRET ?? "";
// const INTERNAL_CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID ?? "";

// interface KakaoProfile {
//   kakaoId: string;
//   email?: string;
//   nickname: string;
//   image?: string;
// }

// interface KakaoLoginResult {
//   status: "login" | "signup";
//   token?: string;
//   user?: User;
//   profile?: KakaoProfile;
// }

// // ✅ 로그인 시도: 로그인 성공 → status: "login", 회원 없으면 → status: "signup" + profile 반환
// export async function loginWithKakao({ code }: { code: string }): Promise<KakaoLoginResult> {
//   try {
//     // 1. 인가코드로 access_token 요청
//     const tokenRes = await fetch(KAKAO_TOKEN_URL, {
//       method: "POST",
//       headers: { "Content-Type": "application/x-www-form-urlencoded" },
//       body: new URLSearchParams({
//         grant_type: "authorization_code",
//         client_id: CLIENT_ID,
//         redirect_uri: REDIRECT_URI,
//         client_secret: CLIENT_SECRET,
//         code,
//       }),
//     });

//     const tokenData = await tokenRes.json();
//     const accessToken = tokenData.access_token;
//     if (!accessToken) throw new Error("카카오 access_token 없음");

//     // 2. access_token으로 프로필 요청
//     const profileRes = await fetch(KAKAO_API_URL, {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//         "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
//       },
//     });

//     const profile = await profileRes.json();
//     const kakaoId = profile?.id?.toString() ?? "";
//     const emailRaw = profile.kakao_account?.email;
//     const email = typeof emailRaw === "string" && emailRaw.includes("@") ? emailRaw : undefined;
//     const nickname = profile.kakao_account?.profile?.nickname ?? "";
//     const image = profile.kakao_account?.profile?.profile_image_url ?? "";

//     if (!kakaoId) throw new Error("kakaoId 없음");

//     // 3. 우리 API에 로그인 시도
//     const loginRes = await fetch(`${BACKEND_URL}/users/login/with`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "Client-id": INTERNAL_CLIENT_ID,
//       },
//       body: JSON.stringify({ providerAccountId: kakaoId }),
//     });

//     if (loginRes.ok) {
//       const loginData = await loginRes.json();
//       return {
//         status: "login",
//         token: loginData.token,
//         user: loginData.user,
//       };
//     }

//     // 4. 회원가입이 필요한 경우 profile 전달
//     return JSON.parse(
//       JSON.stringify({
//         status: "signup",
//         profile: { kakaoId, email, nickname, image },
//       })
//     );
//   } catch (err) {
//     console.error("[loginWithKakao] 오류:", err);
//     throw new Error("카카오 로그인 처리 중 오류 발생");
//   }
// }

// // ✅ 회원가입: 프로필 정보로 회원가입 시도 후 token + user 반환
// export async function signupWithKakao(profile: KakaoProfile): Promise<{ token: string; user: User }> {
//   try {
//     const signupRes = await fetch(`${BACKEND_URL}/users/signup/oauth`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "Client-id": INTERNAL_CLIENT_ID,
//       },
//       body: JSON.stringify({
//         type: "seller", // 또는 'user'
//         loginType: "kakao",
//         extra: { providerAccountId: profile.kakaoId },
//         name: profile.nickname,
//         image: profile.image,
//         ...(profile.email ? { email: profile.email } : {}),
//       }),
//     });

//     const signupData = await signupRes.json();

//     if (!signupData.user || !signupData.token) {
//       console.error("[signupWithKakao] 응답값 누락:", signupData);
//       throw new Error("회원가입 실패");
//     }

//     return {
//       token: signupData.token,
//       user: signupData.user,
//     };
//   } catch (err) {
//     console.error("[signupWithKakao] 오류:", err);
//     throw new Error("카카오 회원가입 처리 중 오류 발생");
//   }
// }
