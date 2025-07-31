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

/**
 * 리뷰를 제출하는 함수
 * @param {ApiRes<SubmitReviewResponse> | null} state - 이전 상태(사용하지 않음)
 * @param {FormData} formData - 리뷰 정보를 담은 FormData 객체
 * @returns {Promise<ApiRes<SubmitReviewResponse>>} - 리뷰 제출 결과 응답 객체
 * @description
 * 리뷰를 제출하고, 성공 시 관련 페이지를 재검증합니다.
 */
