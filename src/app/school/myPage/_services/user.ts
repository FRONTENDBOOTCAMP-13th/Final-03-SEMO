import { User } from "@/types/user";
import { UserResponse } from "../_types/apiResponse";
import apiClient from "./apiClient";

/**
 * 사용자 ID로 사용자 정보를 가져옵니다.
 * @param userId 사용자 ID
 * @returns 사용자 정보
 */
export async function getUserById(userId: number): Promise<User> {
  try {
    const data = await apiClient.get<UserResponse>(`/users/${userId}`);
    return data.item;
  } catch (error) {
    console.error(`Error fetching user ${userId}:`, error);
    throw error;
  }
}

// 이전코드
// import { User } from "@/types/user";
// import AuthService from "./authService";

// const API_URL = process.env.NEXT_PUBLIC_API_URL;
// const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID;

// /**
//  * API 요청용 헤더 생성
//  */
// const createHeaders = (): HeadersInit => {
//   const headers: HeadersInit = {
//     "client-id": CLIENT_ID ?? "",
//     "Content-Type": "application/json",
//   };

//   const token = AuthService.getAccessToken();

//   if (token) {
//     headers["Authorization"] = `Bearer ${token}`;
//   }

//   return headers;
// };

// /**
//  * 사용자 ID로 사용자 정보를 가져옵니다.
//  * @param userId 사용자 ID
//  * @returns 사용자 정보
//  */
// export async function getUserById(userId: number): Promise<User> {
//   try {
//     const headers = createHeaders();
//     const response = await fetch(`${API_URL}/users/${userId}`, { headers });
//     if (!response.ok) {
//       throw new Error("Failed to fetch user data");
//     }
//     const data = await response.json();
//     return data.item as User;
//   } catch (error) {
//     console.error(`Error fetching user ${userId}:`, error);
//     // 에러 발생 시 기본 사용자 정보 또는 null을 반환할 수 있습니다.
//     // 여기서는 호출하는 쪽에서 처리하도록 에러를 다시 던집니다.
//     throw error;
//   }
// }
