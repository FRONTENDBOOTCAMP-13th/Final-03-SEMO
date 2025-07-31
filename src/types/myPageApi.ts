// 실제 API 응답 구조에 맞는 타입 정의
import { User } from "@/types/user";

export interface ProductItem {
  _id: number;
  name: string;
  price: number;
  quantity: number;
  mainImages?: Array<{
    "path ": string;
    name: string;
    originalname: string;
  }>;
  extra: {
    category: string;
    location: string;
    crt: string;
    type?: string;
    marketType?: string;
  };
  seller?: {
    _id: number;
    name: string;
    email: string;
    image: string;
  };
  show: boolean;
  shippingFees: number;
  seller_id: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  replies?: number;
  rating?: number;
  bookmarks?: number;
  options?: number;
  orders?: number;
  ordersQuantity?: number;
}

export interface PostItem {
  _id: number;
  extra: {
    category: string;
    price: number;
    location: string;
    crt: string;
    newAccount: string;
  };
  image: string;
  type: string;
  title: string;
  user: {
    _id: number;
    type: string;
    name: string;
    email: string;
    image: string;
  };
}

export interface BookmarkItem {
  _id: number;
  createdAt: string;
  post: PostItem;
}

export interface OrderItem {
  _id: number;
  products: Array<{
    _id: number;
    quantity: number;
    seller_id: number;
    name: string;
    image: {
      "path ": string;
      name: string;
      originalname: string;
    };
    price: number;
    extra: {
      category?: string;
      location?: string;
      crt: string;
      type?: string;
    };
  }>;
  extra?: {
    "location:"?: string;
  };
  state: string;
  user_id: number;
  createdAt: string;
  updatedAt: string;
  cost: {
    products: number;
    shippingFees: number;
    discount: {
      products: number;
      shippingFees: number;
    };
    total: number;
  };
}

// API 응답 타입
export interface BookmarkResponse {
  ok: 1;
  [key: string]: BookmarkItem | number; // 인덱스로 접근하는 형태
}

export interface OrderResponse {
  ok: 1;
  item: OrderItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ProductResponse {
  ok: 1;
  item: ProductItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface UserResponse {
  ok: 1;
  item: User;
}

export interface ReviewItem {
  _id: number;
  order_id: number;
  product_id: number;
  rating: number;
  content: string;
  user_id: number;
  user: {
    _id: number;
    name: string;
    image: string;
  };
  createdAt: string;
}

export interface SubmitReviewResponse {
  ok: 1;
  item: ReviewItem;
}
