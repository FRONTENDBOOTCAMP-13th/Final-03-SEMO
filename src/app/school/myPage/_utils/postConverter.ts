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

/**
 * ProductItem을 MyPageItem 타입으로 변환합니다.
 */
export function productToMyPageItem(product: ProductItem): MyPageItem {
  const mainImage = product.mainImages?.[0];

  // 이미지 경로 안전 처리
  let imageUrl = "/assets/defaultimg.png";
  if (mainImage?.path) {
    imageUrl = `${process.env.NEXT_PUBLIC_API_URL}/${mainImage.path}`;
  }

  return {
    id: product._id,
    title: product.name,
    image: imageUrl,
    price: `${product.price.toLocaleString()}원`,
    status: product.extra.crt === "판매완료" ? "판매완료" : "판매중",
    category: getCategoryFromType(product.extra.type || product.extra.marketType || "sell"),
  };
}

/**
 * OrderItem을 Review 배열로 변환합니다 (구매한 상품 리뷰 작성용).
 */
export async function orderToReviewItems(order: OrderItem): Promise<Review[]> {
  // 주문의 extra에서 위치 정보를 가져옵니다.
  const location = order.extra?.["location:"] || "";

  const reviewPromises = order.products.map(async (product) => {
    let authorName = "판매자";
    if (product.seller_id) {
      try {
        const sellerData = await getUserById(product.seller_id);
        authorName = sellerData.name || `판매자 ${product.seller_id}`;
      } catch {
        // 판매자 정보 로딩 실패 시 에러 로깅 제거
      }
    }

    return {
      id: product._id,
      title: product.name,
      author: authorName,
      image: product.image ? `${process.env.NEXT_PUBLIC_API_URL}/${product.image["path "]}` : "/assets/defaultimg.png",
      location: location, // 모든 리뷰 아이템에 동일한 위치 정보 적용
      date: new Date(order.createdAt)
        .toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
        .replace(/\. /g, "년 ")
        .replace(/\.$/, "일"),
    };
  });

  return Promise.all(reviewPromises);
}

/**
 * BookmarkItem 배열을 MyPageItem 배열로 변환합니다.
 */
export function bookmarksToWishlistItems(bookmarks: BookmarkItem[]): MyPageItem[] {
  return bookmarks.map(bookmarkToWishlistItem);
}

/**
 * ProductItem 배열을 MyPageItem 배열로 변환합니다.
 */
export function productsToMyPageItems(products: ProductItem[]): MyPageItem[] {
  return products.map(productToMyPageItem);
}

/**
 * OrderItem 배열을 Review 배열로 변환합니다.
 */
export async function ordersToReviewItems(orders: OrderItem[]): Promise<Review[]> {
  const reviewPromises = orders.flatMap((order) => orderToReviewItems(order));
  return (await Promise.all(reviewPromises)).flat(); // flatMap으로 중첩 배열 평면화
}
