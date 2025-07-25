// 실제 API 응답 구조에 맞는 타입 정의

export interface ProductItem {
  _id: number;
  name: string;
  price: number;
  quantity: number;
  mainImages?: Array<{
    path: string;
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
