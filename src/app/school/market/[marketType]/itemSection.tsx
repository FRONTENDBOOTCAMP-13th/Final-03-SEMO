"use client";
import Link from "next/link";
import Image from "next/image";
import { Post } from "@/types";
import { Heart, MessageCircleMore } from "lucide-react";
import { getImageUrl } from "@/app/api/market/action/file";

// interface Item {
//   _id: number;
//   title: string;
//   image: string | null;
// }
interface Props {
  items: Post[];
  market: "buy" | "sell";
}

export default function ItemSection({ items, market }: Props) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {items.map((item) => (
        <Link key={item._id} href={`/school/market/${market}/${item._id}`} className="block rounded-lg p-2">
          <Image
            src={getImageUrl(item.image)}
            alt={item.title}
            width={150}
            height={150}
            className="rounded-lg object-cover w-full h-[150px]"
          />
          <p className="mt-2 text-16 font-medium truncate">{item.title}</p>
          <p className="text-14 text-uni-gray-300 font-light truncate">{Number(item.extra.price).toLocaleString()}원</p>
          <div className="flex items-center text-14 text-uni-gray-400 mt-1">
            {/* 좋아요 */}
            <div className="flex items-center mr-4">
              <Heart size={15} color="red" strokeWidth={2} />
              <span className="ml-1">0</span>
            </div>

            {/* 댓글 */}
            <div className="flex items-center">
              <MessageCircleMore size={15} color="gray" strokeWidth={2} />
              <span className="ml-1">0</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
