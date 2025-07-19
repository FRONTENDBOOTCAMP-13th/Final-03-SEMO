import { User } from "@/types/user";

export interface Post {
  // 게시글 고유 ID
  _id: number;
  type: string;
  title: string;
  content: string;
  image?: string;
  user: Pick<User, "_id" | "name" | "image">;
  repliesCount: number;
  createdAt: string;
  updatedAt: string;
  product?: {
    image?: string | null;
  };
  extra: {
    category: string;
    price: number;
    location: string;
    crt: string;
    newAccount: string;
  };
}
