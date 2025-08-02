import Image from "next/image";
import CommentList from "./CommentList";
// import PostActions from "./PostActions";
import { Post, PostType } from "@/types";
// import { Heart } from "lucide-react";
import { getImageUrl } from "@/data/actions/file";
import PostLikeButton from "./PostLikeButton";
import Countdown from "@/app/school/market/_components/_PostComponents/Countdown";
import ChatStartButton from "@/app/school/chat/components/chatStartBtn";

interface PostContentProps {
  post: Post;
  marketType: PostType;
}

export default function PostContent({ post, marketType }: PostContentProps) {
  const totalPrice = Number(post?.extra?.price || "0");
  const participants = post?.extra?.participants || 1;
  const pricePerPerson = Math.floor(totalPrice / participants);
  if (marketType === "buy" || marketType === "sell") {
    return (
      <div className="min-w-[320px] max-w-[480px] mx-auto px-4 min-h-screen bg-uni-white">
        {/* 이미지 */}
        <div className="rounded-lg overflow-hidden mb-4 bg-uni-gray-100">
          {post?.image ? (
            <Image
              src={getImageUrl(post.image)}
              alt={post.title}
              width={350}
              height={300}
              className="w-full h-auto object-cover"
              unoptimized={true}
            />
          ) : (
            <div className="w-full h-[300px] bg-uni-gray-100 rounded-lg mb-4" />
          )}
        </div>

        {/* 제목 + 좋아요 */}
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-bold text-22">{post?.title}</h2>
          {/* <Heart size={20} color="red" strokeWidth={2} /> */}
          <PostLikeButton postId={post._id} />
        </div>

        {/* <PostActions post={post} /> */}

        {/* 가격 */}
        <p className="text-14 text-uni-gray-400 mb-4">
          {post?.extra?.price != null ? `${Number(post?.extra.price).toLocaleString()}원` : "가격 정보 없음"}
        </p>

        {/* 작성자 */}
        <div className="flex items-center gap-3 my-2">
          <Image
            src={getImageUrl(post.user.image)}
            alt=""
            width={56}
            height={56}
            className="w-14 h-14 object-cover rounded-full"
          />
          <div>
            <p className="text-16">{post?.user.name}</p>
            <p className="text-14 text-uni-gray-300">{post?.extra.location}</p>
          </div>
        </div>

        {/* 상태 */}
        <div className="my-3">
          <span className="inline-block bg-uni-green-300 text-uni-white text-14 font-bold rounded-xl px-4 py-1.5">
            {post?.extra.crt}
          </span>
        </div>

        {/* 설명 */}
        <p className="text-gray-700 mb-2 text-16">{post?.content}</p>
        <p className="text-12 text-uni-gray-300 mb-6">{post?.createdAt}</p>
        {post?._id && Number.isInteger(post._id) && <CommentList _id={post._id} post={post} />}

        <div className=" w-full max-w-[480px] bg-white">
          {post.user?._id && (
            <ChatStartButton
              sellerId={post.user._id.toString()}
              // sellerNickName={post.user.name}
              productId={post._id.toString()}
            />
          )}
        </div>
      </div>
    );
  }
  return (
    <div className="min-w-[320px] max-w-[480px] mx-auto px-4 min-h-screen bg-uni-white">
      {/* 이미지 */}
      <div className="rounded-lg overflow-hidden mb-4 bg-uni-gray-100">
        {post?.image ? (
          <Image
            src={getImageUrl(post.image)}
            alt={post.title}
            width={350}
            height={300}
            className="w-full h-auto object-cover"
            unoptimized={true}
          />
        ) : (
          <div className="w-full h-[300px] bg-uni-gray-100 rounded-lg mb-4" />
        )}
      </div>

      {/* 제목 + 좋아요 */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-bold text-22">{post?.title}</h2>
        {/* <Heart size={20} color="red" strokeWidth={2} /> */}
        <PostLikeButton postId={post._id} />
      </div>

      {/* <PostActions post={post} /> */}

      {/* 가격 */}
      <p className="text-14 text-uni-gray-400 mb-4">
        {post?.extra?.price != null ? `${Number(post?.extra.price).toLocaleString()}원` : "가격 정보 없음"}
      </p>

      {/* 작성자 */}
      <div className="flex items-center gap-3 my-2">
        <Image
          src={getImageUrl(post.user.image)}
          alt=""
          width={56}
          height={56}
          className="w-14 h-14 object-cover rounded-full"
        />
        <div>
          <p className="text-16">{post?.user.name}</p>
          <p className="text-14 text-uni-gray-300">{post?.extra.location}</p>
        </div>
      </div>

      {/* 상태 */}
      <div className="my-3">
        <span className="inline-block bg-uni-green-400 text-uni-white text-14 font-bold rounded-[12px] p-10 mr-2 px-4.5 py-1.5">
          {post?.extra.crt}
        </span>
        <span className="inline-block bg-uni-gray-200 text-uni-gray-400 text-14 font-bold rounded-[12px] p-10  mr-2 px-4.5 py-1.5">
          {post?.extra.participants}명
        </span>
        <span className="inline-block bg-uni-gray-200 text-uni-gray-400 text-14 font-bold rounded-[12px] p-10  mr-2 px-4.5 py-1.5">
          인당 {pricePerPerson.toLocaleString()}원
        </span>
      </div>

      {/* 설명 */}
      <p className="text-gray-700 mb-2 text-16">{post?.content}</p>
      <p className="text-12 text-uni-gray-300 mb-6">{post?.createdAt}</p>

      {/* 분배 장소 */}
      <div className="border-2 border-uni-gray-200 rounded-lg p-3 mb-2 mt-10">
        <p className="text-14 font-medium text-uni-gray-500 mb-1">분배 장소</p>
        <p className="text-14 text-uni-blue-400 font-bold">{post?.extra.groupLocation}</p>
      </div>
      {/* 마감기한 */}
      <div className="border-2 border-uni-gray-200 rounded-lg p-3 mb-10">
        <p className="text-14 font-medium text-uni-gray-500 mb-1">기한</p>
        <p className="text-14 text-uni-gray-300">
          {post?.extra.deadLine
            ? `${new Date(post.extra.deadLine).toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })} ${new Date(post.extra.deadLine).toLocaleTimeString("ko-KR", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })}까지`
            : "마감시간 없음"}
        </p>
        {post?.extra.deadLine && <Countdown deadLine={post.extra.deadLine} />}
      </div>

      {post?._id && Number.isInteger(post._id) && <CommentList _id={post._id} post={post} />}

      <div className=" w-full max-w-[480px] bg-white">
        {post.user?._id && (
          <ChatStartButton
            sellerId={post.user._id.toString()}
            // sellerNickName={post.user.name}
            productId={post._id.toString()}
          />
        )}
      </div>
    </div>
  );
}
