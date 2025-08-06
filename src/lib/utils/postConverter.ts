import { BookmarkItem, OrderItem, PostItem } from "@/types/myPageApi";
import { getCachedUser } from "@/data/functions/myPage";
import { getImageUrl } from "@/data/actions/file";

const sellerCache: { [key: string]: { name: string; image?: string; address?: string } } = {};

export interface MyPageItem {
  id: number;
  title: string;
  image: string;
  price: string;
  status: "판매중" | "판매완료";
  marketType: "sell" | "buy" | "groupPurchase"; // marketType 필드 추가
}

export interface Review {
  id: number; // product_id
  orderId: number; // order_id 추가
  title: string;
  author: string;
  image: string; // 상품 이미지
  sellerProfileImage?: string; // 판매자 프로필 이미지 (새로 추가)
  location?: string; // 위치 정보는 선택적
  date: string;
}

/**
 * BookmarkItem을 MyPageItem 타입으로 변환합니다.
 */
export function bookmarkToWishlistItem(bookmark: BookmarkItem): MyPageItem {
  const post = bookmark.post; // product 대신 post 사용

  // 이미지 경로 안전 처리
  const imageUrl = getImageUrl(post.image);

  // 가격을 숫자형으로 변환하여 toLocaleString() 적용
  const price = Number(post.extra?.price);
  const formattedPrice = isNaN(price) ? "가격 정보 없음" : `${price.toLocaleString()}원`;

  return {
    id: post._id,
    title: post.title,
    image: imageUrl,
    price: formattedPrice,
    status: post.extra?.crt === "판매완료" ? "판매완료" : "판매중",
    marketType: ["sell", "buy", "groupPurchase"].includes(post.type)
      ? (post.type as "sell" | "buy" | "groupPurchase")
      : "sell",
  };
}

/**
 * PostItem을 MyPageItem 타입으로 변환합니다.
 */
export function postToMyPageItem(post: PostItem, sourceType?: "sell" | "buy" | "groupPurchase"): MyPageItem {
  // 이미지 경로 안전 처리
  const imageUrl = getImageUrl(post.image);

  // 가격을 숫자형으로 변환하여 toLocaleString() 적용
  const price = Number(post.extra?.price);
  const formattedPrice = isNaN(price) ? "가격 정보 없음" : `${price.toLocaleString()}원`;

  // sourceType이 제공되면 그것을 사용하고, 아니면 post.type을 기반으로 결정
  const determinedMarketType = sourceType
    ? sourceType
    : ["sell", "buy", "groupPurchase"].includes(post.type)
      ? (post.type as "sell" | "buy" | "groupPurchase")
      : "sell";

  return {
    id: post._id,
    title: post.title,
    image: imageUrl,
    price: formattedPrice,
    status: post.extra?.crt === "판매완료" ? "판매완료" : "판매중",
    marketType: determinedMarketType,
  };
}

/**
 * OrderItem을 Review 배열로 변환합니다 (구매한 상품 리뷰 작성용).
 */
export async function orderToReviewItems(order: OrderItem): Promise<Review[]> {
  const reviewPromises = order.products.map(async (product) => {
    let authorName = "판매자";
    let sellerProfileImageUrl = "/assets/defaultimg.png"; // 판매자 프로필 이미지
    let sellerAddress = "위치 정보 없음"; // 판매자 주소 정보

    if (product.seller_id) {
      if (sellerCache[product.seller_id]) {
        authorName = sellerCache[product.seller_id].name;
        sellerProfileImageUrl = sellerCache[product.seller_id].image || "/assets/defaultimg.png";
        sellerAddress = sellerCache[product.seller_id].address || "위치 정보 없음";
      } else {
        try {
          const sellerData = await getCachedUser(product.seller_id);
          if (sellerData) {
            authorName = sellerData.name || `판매자 ${product.seller_id}`;
            sellerProfileImageUrl = getImageUrl(sellerData.image);
            sellerAddress = sellerData.address || "위치 정보 없음"; // 판매자 주소 정보 추가
            sellerCache[product.seller_id] = {
              name: authorName,
              image: sellerProfileImageUrl,
              address: sellerAddress,
            };
          }
        } catch {
          // 판매자 정보 로딩 실패 시 에러 로깅 제거
        }
      }
    }

    return {
      id: product._id,
      orderId: order._id, // order_id 추가
      title: product.name,
      author: authorName,
      image: getImageUrl(product.image?.path), // 상품 이미지 (path 키에서 공백 제거)
      sellerProfileImage: sellerProfileImageUrl, // 판매자 프로필 이미지
      location: sellerAddress, // 판매자 주소 정보 사용
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
 * PostItem 배열을 MyPageItem 배열로 변환합니다.
 */
export function postsToMyPageItems(posts: PostItem[], sourceType?: "sell" | "buy" | "groupPurchase"): MyPageItem[] {
  return posts.map((post: PostItem) => postToMyPageItem(post, sourceType));
}

/**
 * OrderItem 배열을 Review 배열로 변환합니다.
 */
export async function ordersToReviewItems(orders: OrderItem[]): Promise<Review[]> {
  const reviewPromises = orders.flatMap((order) => orderToReviewItems(order));
  return (await Promise.all(reviewPromises)).flat(); // flatMap으로 중첩 배열 평면화
}
