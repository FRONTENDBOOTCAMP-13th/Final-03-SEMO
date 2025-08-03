"use server";

import { ApiRes, ApiResPromise } from "@/types";
import { User } from "@/types/myPageUser";
import { SubmitReviewResponse } from "@/types/myPageApi";
import { revalidatePath } from "next/cache";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || "";

interface SubmitReviewPayload {
  order_id: number;
  product_id: number;
  rating: number;
  content: string;
}

/**
 * 사용자 정보를 업데이트하는 함수
 * @param {ApiRes<User> | null} state - 이전 상태(사용하지 않음)
 * @param {FormData} formData - 사용자 정보를 담은 FormData 객체
 * @returns {Promise<ApiRes<User>>} - 업데이트 결과 응답 객체
 * @description
 * 사용자 정보를 업데이트하고, 프로필 이미지가 있으면 파일 업로드도 처리합니다.
 */
export async function updateUser(state: ApiRes<User> | null, formData: FormData): ApiResPromise<User> {
  let res: Response;
  let data: ApiRes<User>;

  try {
    const userId = formData.get("userId") as string;
    const accessToken = formData.get("accessToken") as string;
    const removeImage = formData.get("removeImage") === "true";
    const imageUrl = formData.get("imageUrl") as string;

    // 이미지 처리
    let image;
    if (removeImage) {
      image = "";
    } else if (imageUrl) {
      // 클라이언트에서 이미 업로드된 이미지 URL 사용
      image = imageUrl;
    }

    // 사용자 정보 업데이트 요청 바디 생성
    const body: Partial<User> = {};

    // 기본 정보 업데이트
    const name = formData.get("name");
    const email = formData.get("email");
    if (name) body.name = name as string;
    if (email) body.email = email as string;
    if (image !== undefined) body.image = image;

    // extra 정보 처리
    const nickname = formData.get("nickname");
    const bank = formData.get("bank");
    const bankNumber = formData.get("bankNumber");

    if (nickname || bank || bankNumber) {
      body.extra = {};
      if (nickname) body.extra.nickname = nickname as string;
      if (bank) body.extra.bank = bank as string;
      if (bankNumber) body.extra.bankNumber = parseInt(bankNumber as string);
    }

    console.log(`body`, body);

    // 사용자 정보 업데이트 API 호출
    res = await fetch(`${API_URL}/users/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Client-Id": CLIENT_ID,
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });

    data = await res.json();

    if (data.ok) {
      revalidatePath("/school/myPage");
      revalidatePath(`/users/${userId}`);
    }
  } catch (error) {
    // 네트워크 오류 처리
    console.error(error);
    return { ok: 0, message: "일시적인 네트워크 문제가 발생했습니다." };
  }

  return data;
}

/**
 * 리뷰를 제출하는 함수
 * @param {ApiRes<SubmitReviewResponse> | null} state - 이전 상태(사용하지 않음)
 * @param {FormData} formData - 리뷰 정보를 담은 FormData 객체
 * @returns {Promise<ApiRes<SubmitReviewResponse>>} - 리뷰 제출 결과 응답 객체
 * @description
 * 리뷰를 제출하고, 성공 시 관련 페이지를 재검증합니다.
 */
export async function submitReview(
  state: ApiRes<SubmitReviewResponse> | null,
  formData: FormData
): ApiResPromise<SubmitReviewResponse> {
  let res: Response;
  let data: ApiRes<SubmitReviewResponse>;

  try {
    const accessToken = formData.get("accessToken") as string;

    const body: SubmitReviewPayload = {
      order_id: parseInt(formData.get("order_id") as string),
      product_id: parseInt(formData.get("product_id") as string),
      rating: parseInt(formData.get("rating") as string),
      content: formData.get("content") as string,
    };

    console.log(`submitReview body`, body);

    // 리뷰 제출 API 호출
    res = await fetch(`${API_URL}/replies/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Client-Id": CLIENT_ID,
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });

    data = await res.json();

    if (data.ok) {
      revalidatePath("/school/myPage/(history)");
      revalidatePath("/school/myPage/write-review");
    }
  } catch (error) {
    // 네트워크 오류 처리
    console.error(error);
    return { ok: 0, message: "일시적인 네트워크 문제로 리뷰 제출에 실패했습니다." };
  }

  return data;
}
