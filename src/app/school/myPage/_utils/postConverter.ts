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

/**
 * BookmarkItem을 MyPageItem 타입으로 변환합니다.
 */
export function bookmarkToWishlistItem(bookmark: BookmarkItem): MyPageItem {
  const post = bookmark.post; // product 대신 post 사용

  // 이미지 경로 안전 처리
  let imageUrl = "/assets/defaultimg.png";
  if (post.image) {
    // mainImages 대신 image 사용
    imageUrl = `${process.env.NEXT_PUBLIC_API_URL}/${post.image}`;
  }

  return {
    id: post._id,
    title: post.title, // product.name 대신 post.title 사용
    image: imageUrl,
    price: `${post.extra.price.toLocaleString()}원`, // product.price 대신 post.extra.price 사용
    status: post.extra.crt === "판매완료" ? "판매완료" : "판매중", // product.extra.crt 대신 post.extra.crt 사용
    category: getCategoryFromType(post.type || post.extra.category || "sell"), // product.extra.type || product.extra.marketType 대신 post.type || post.extra.category 사용
  };
}
