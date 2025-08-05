import { ApiResPromise } from "@/types/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || "";

/**
 * 판매자 구매 후기 목록 응답 타입
 */
export interface SellerReviewsResponse {
  ok: 1;
  item: SellerReviewItem[];
}

export interface SellerReviewItem {
  _id: number;
  product_id: number;
  price: number;
  name: string;
  image: string | null;
  replies: SellerReply[];
}

export interface SellerReply {
  user: {
    _id: number;
    image: string;
    name: string;
  };
  _id: number;
  rating: number;
  content: string;
  createdAt: string;
}

/**
 * 판매자의 구매 후기 목록을 가져옵니다.
 * @param sellerId - 판매자 ID
 * @returns {Promise<ApiRes<SellerReviewItem[]>>} - 후기 목록 응답 객체
 */
export async function getSellerReviews(sellerId: string): ApiResPromise<SellerReviewItem[]> {
  try {
    const res = await fetch(`${API_URL}/replies/seller/${sellerId}`, {
      headers: {
        "Client-Id": CLIENT_ID,
      },
      cache: "no-store", // 실시간 데이터
    });

    if (!res.ok) {
      console.error("HTTP 오류:", res.status, res.statusText);
      return { ok: 0, message: "서버에서 데이터를 가져오는데 실패했습니다." };
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("판매자 후기 목록 조회 오류:", error);
    return { ok: 0, message: "일시적인 네트워크 문제로 후기 목록을 불러올 수 없습니다." };
  }
}
