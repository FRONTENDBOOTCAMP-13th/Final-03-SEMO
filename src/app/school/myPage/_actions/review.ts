import apiClient from "@/lib/apiClient";
import { SubmitReviewResponse } from "@/app/school/myPage/_types/apiResponse";

interface SubmitReviewPayload {
  order_id: number;
  product_id: number;
  rating: number;
  content: string;
}

export const submitReview = async (payload: SubmitReviewPayload) => {
  try {
    const response = await apiClient.post<SubmitReviewResponse>("/replies/", payload);
    return response;
  } catch (error) {
    console.error("리뷰 제출 실패:", error);
    throw error;
  }
};
