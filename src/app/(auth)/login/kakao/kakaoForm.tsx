// "use client";

// import { useEffect } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { loginWithKakao, signupWithKakao } from "@/lib/actions/kakao";
// import { useUserStore } from "@/store/userStore";

// export default function KakaoForm() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const { setUser } = useUserStore();

//   useEffect(() => {
//     const handleKakaoLogin = async () => {
//       const code = searchParams.get("code");
//       if (!code) {
//         alert("인가 코드가 없습니다.");
//         // router.replace("/login");
//         return;
//       }

//       try {
//         // 1. 카카오 로그인 or 회원가입 판단
//         const loginResult = await loginWithKakao({ code });
//         console.log("[카카오 로그인 결과]:", loginResult);

//         if (loginResult.status === "login") {
//           localStorage.setItem("accessToken", loginResult.token!);
//           console.log("[🔑 로그인 성공! 유저]", loginResult.user);
//           console.log("[🔐 토큰]", loginResult.token);
//           setUser(loginResult.user!);
//           // router.replace("/school");
//           return;
//         }

//         if (loginResult.status === "signup") {
//           if (!loginResult.profile) {
//             console.error("profile 정보 누락됨");
//             router.replace("/login");
//             return;
//           }

//           // 2. 회원가입 시도
//           const signupResult = await signupWithKakao(loginResult.profile);
//           console.log("[회원가입 성공]:", signupResult);

//           localStorage.setItem("accessToken", signupResult.token);
//           setUser(signupResult.user);
//           console.log("[🧠 Zustand 저장된 유저]", signupResult.user);

//           router.replace("/school");
//         }
//       } catch (err) {
//         console.error("카카오 로그인 처리 실패:", err);
//         alert("카카오 로그인 중 오류가 발생했습니다.");
//         // router.replace("/login");
//       }
//     };

//     handleKakaoLogin();
//   }, [router, searchParams, setUser]);

//   return <p className="text-center mt-20">카카오 로그인 중입니다...</p>;
// }
