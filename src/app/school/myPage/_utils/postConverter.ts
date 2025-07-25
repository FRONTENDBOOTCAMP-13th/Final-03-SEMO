import { BookmarkItem, OrderItem, ProductItem } from "../_types/apiResponse";
import { getUserById } from "../_services/user"; // getUserById import

export interface MyPageItem {
  id: number;
  title: string;
  image: string;
  price: string;
  status: "판매중" | "판매완료";
  category: "팔래요" | "살래요" | "모여요";
}

export interface Review {
  id: number;
  title: string;
  author: string;
  image: string;
  location?: string; // 위치 정보는 선택적
  date: string;
}

/**
 * API의 type 필드를 마이페이지 카테고리로 변환합니다.
 */
function getCategoryFromType(type: string): "팔래요" | "살래요" | "모여요" {
  switch (type) {
    case "sell":
      return "팔래요";
    case "buy":
      return "살래요";
    case "gather":
      return "모여요";
    default:
      return "팔래요"; // 기본값
  }
}
