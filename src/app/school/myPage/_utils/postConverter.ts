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
