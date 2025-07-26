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
  tag: string;
  updatedAt: string;
  extra: {
    product?: {
      image?: string | null;
    };
    price: number;
    location: string;
    crt: string;
    newAccount: string;
  };
}

export interface PostReply {
  // 답글의 고유 ID
  _id: number;
  // 답글 작성자 정보 (id, 이름, 이미지)
  user: Pick<User, "_id" | "name" | "image">;
  // 답글 내용
  content: string;
  // 답글의 좋아요 수
  like: number;
  // 답글 생성일
  createdAt: string;
  // 답글 수정일
  updatedAt: string;
}

/**
 * 답글 작성 폼에서 사용하는 타입 (content만 포함)
 */
export type PostReplyForm = Pick<PostReply, "content">;
