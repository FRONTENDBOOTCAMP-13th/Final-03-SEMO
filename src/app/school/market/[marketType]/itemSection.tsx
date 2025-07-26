"use client";
import Link from "next/link";
import Image from "next/image";
import { Post } from "@/types";
import { MessageCircleMore } from "lucide-react";
import { getImageUrl } from "@/data/actions/file";

// interface Item {
//   _id: number;
//   title: string;
//   image: string | null;
// }
interface Props {
  items: Post[];
  market: "buy" | "sell";
  _id?: number;
}

export default function ItemSection({ items, market }: Props) {
  if (!items || items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-15">
        <p className="text-15 text-gray-400 font-medium">해당 조건의 게시글이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {items.map((item) => (
        <Link key={item._id} href={`/school/market/${market}/${item._id}`} className="block rounded-lg">
          <Image
            src={getImageUrl(item.image)}
            alt={item.title}
            width={160}
            height={160}
            className="rounded-lg object-cover w-full h-[160px]"
          />
          <p className="mt-2 text-16 font-medium truncate">{item.title}</p>
          <div className="flex items-center justify-between text-14 text-uni-gray-400 mt-1">
            <p className="text-14 text-uni-gray-300 font-light truncate">
              {Number(item.extra.price).toLocaleString()}원
            </p>
            {/* 좋아요
            <div className="flex items-center mr-4">
              <Heart size={15} color="red" strokeWidth={2} />
              <span className="ml-1">0</span>
            </div> */}

            {/* 댓글 */}
            <div className="flex items-center">
              <MessageCircleMore size={15} color="gray" strokeWidth={2} />
              <span className="ml-1">{item.repliesCount || 0}</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
