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
  console.log("=== Post 데이터 확인 ===");
  console.log("post.isLiked:", post.isLiked);
  console.log("post 전체:", post);
  const totalPrice = Number(post?.extra?.price || "0");
  const participants = post?.extra?.participants || 1;
  const pricePerPerson = Math.floor(totalPrice / participants);
  if (marketType === "buy" || marketType === "sell") {
    return (
      <main className="min-w-[320px] max-w-[480px] mx-auto px-4 min-h-screen bg-uni-white">
        {/* 이미지 */}
        <h1 className="sr-only">상품 상세 정보</h1>
        <figure className="rounded-lg overflow-hidden mb-4 bg-uni-gray-100" aria-labelledby="product-image-caption">
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
          <figcaption id="product-image-caption" className="sr-only">
            {post?.title} 상품 이미지
          </figcaption>
        </figure>

        {/* 제목 + 좋아요 */}
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-bold text-22" id="product-title">
            {post?.title}
          </h2>
          <aside className="like-section" aria-label="좋아요">
            <PostLikeButton postId={post._id} initialLiked={post.isLiked} />
          </aside>
        </div>

        {/* <PostActions post={post} /> */}

        {/* 가격 */}
        <section className="product-info" aria-labelledby="product-info-title">
          <h3 id="product-info-title" className="sr-only">
            상품 가격 정보
          </h3>
          <span className="sr-only">가격:</span>
          <p className="text-14 text-uni-gray-700 mb-4">
            {post?.extra?.price != null ? `${Number(post?.extra.price).toLocaleString()}원` : "가격 정보 없음"}
          </p>
        </section>

        {/* 작성자 */}
        <div className="flex items-center gap-3 my-2" role="region" aria-label="seller-title">
          <figure className="seller-avatar" aria-label={`${post?.user.name}의 프로필`}>
            <Image
              src={getImageUrl(post.user.image)}
              alt=""
              width={56}
              height={56}
              className="w-14 h-14 object-cover rounded-full"
            />
          </figure>
          <div className="seller-details">
            <p className="text-16">{post?.user.name}</p>
            <p className="text-14 text-uni-gray-700">
              <span className="sr-only">거래 위치:</span>
              {post?.extra.location}
            </p>
          </div>
        </div>

        {/* 상태 */}
        <div className="my-3" role="status" aria-label="상품 상태">
          <span className="inline-block bg-uni-green-400 text-uni-white text-14 font-bold rounded-xl px-4 py-1.5">
            {post?.extra.crt}
          </span>
        </div>

        {/* 설명 */}
        <section className="product-description" aria-label="description-title">
          <h3 id="desc-title" className="sr-only">
            상품 설명
          </h3>
          <p className="text-gray-700 mb-2 text-16">{post?.content}</p>
          <p className="text-12 text-uni-gray-700 mb-6">{post?.createdAt}</p>
        </section>
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
      </main>
    );
  }
  return (
    <main className="min-w-[320px] max-w-[480px] mx-auto px-4 min-h-screen bg-uni-white">
      {/* 이미지 */}
      <div className="">
        <h1 className="sr-only">공동구매 상세 정보</h1>
        <figure
          className="product-image rounded-lg overflow-hidden mb-4 bg-uni-gray-100"
          aria-labelledby="group-image-caption"
        >
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
          <figcaption id="group-image-caption" className="sr-only">
            {post?.title} 공동구매 상품의 대표 이미지
          </figcaption>
        </figure>
      </div>

      {/* 제목 + 좋아요 */}
      <div className="flex justify-between items-center mb-2" role="banner">
        <h2 className="font-bold text-22">{post?.title}</h2>
        <aside className="like-section" aria-label="좋아요">
          <PostLikeButton postId={post._id} initialLiked={post.isLiked} />
        </aside>
      </div>

      {/* <PostActions post={post} /> */}

      {/* 가격 */}
      <section className="group-purchase-info mb-6" aria-labelledby="group-info-title">
        <h3 id="group-info-title" className="sr-only">
          공동구매 정보
        </h3>
        <p className="text-14 text-uni-gray-700 mb-4">
          <span className="sr-only">총 가격:</span>
          {post?.extra?.price != null ? `${Number(post?.extra.price).toLocaleString()}원` : "가격 정보 없음"}
        </p>

        {/* 작성자 */}
        <div className="flex items-center gap-3 my-2">
          <h4 id="organizer-title" className="sr-only">
            공동구매 게시글 작성자
          </h4>
          <figure className="organizer" aria-label={`${post?.user.name}의 프로필`}>
            <Image
              src={getImageUrl(post.user.image)}
              alt=""
              width={56}
              height={56}
              className="w-14 h-14 object-cover rounded-full"
            />
          </figure>
          <div className="details">
            <p className="text-16">{post?.user.name}</p>
            <span className="sr-only">거래 장소</span>
            <p className="text-14 text-uni-gray-700">{post?.extra.location}</p>
          </div>
        </div>

        {/* 상태 */}
        <div className="my-3" role="status" aria-label="공동구매 현황">
          <span className="inline-block bg-uni-green-400 text-uni-white text-14 font-bold rounded-[12px] p-10 mr-2 px-4.5 py-1.5">
            {post?.extra.crt}
          </span>
          <span className="inline-block bg-uni-gray-200 text-uni-gray-800 text-14 font-bold rounded-[12px] p-10  mr-2 px-4.5 py-1.5">
            <span className="sr-only">참여 인원:</span>
            {post?.extra.participants}명
          </span>
          <span className="inline-block bg-uni-gray-200 text-uni-gray-800 text-14 font-bold rounded-[12px] p-10  mr-2 px-4.5 py-1.5">
            <span className="sr-only">인당 가격:</span>
            인당 {pricePerPerson.toLocaleString()}원
          </span>
        </div>
      </section>

      {/* 설명 */}
      <section className="product-description mb-6" aria-label="group-description-title">
        <h3 id="group-desc" className="sr-only">
          상품 설명
        </h3>
        <p className="text-gray-700 mb-2 text-16">{post?.content}</p>
        <p className="text-12 text-uni-gray-700 mb-6">{post?.createdAt}</p>
      </section>

      {/* 분배 장소 */}
      <section className="group-details mb-6" aria-label="group-details-title">
        <h3 id="group-details-title" className="sr-only">
          공동구매 세부 정보
        </h3>
        <div className="border-2 border-uni-gray-200 rounded-lg p-3 mb-2 mt-10" aria-label="location-title">
          <p className="text-14 font-medium text-uni-gray-500 mb-1">분배 장소</p>
          <p className="text-14 text-uni-blue-400 font-bold">{post?.extra.groupLocation}</p>
        </div>
        {/* 마감기한 */}
        <div className="border-2 border-uni-gray-200 rounded-lg p-3 mb-10" aria-label="deadLine">
          <p className="text-14 font-medium text-uni-gray-700 mb-1">기한</p>
          <p className="text-14 text-uni-gray-700">
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
      </section>

      {post?._id && Number.isInteger(post._id) && <CommentList _id={post._id} post={post} />}

      <div className=" w-full max-w-[480px] bg-white">
        {post.user?._id && <ChatStartButton sellerId={post.user._id.toString()} productId={post._id.toString()} />}
      </div>
    </main>
  );
}
