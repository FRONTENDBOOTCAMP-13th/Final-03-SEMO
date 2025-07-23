import Image from "next/image";
import CommentList from "./CommentList";
import PostActions from "./PostActions";
import { Post } from "@/types";
import { getImageUrl } from "@/data/actions/file";
interface PostContentProps {
  post: Post;
}

export default function PostContent({ post }: PostContentProps) {
  // if (!post || !post._id || !post.title || !post.user) {
  //   return (
  //     <div className="min-w-[320px] max-w-[480px] mx-auto px-4 py-6 min-h-screen bg-uni-white flex items-center justify-center">
  //       <p className="text-uni-gray-400">게시글이 없으면 리스트로 이동</p>
  //     </div>
  //   );
  // }
  return (
    <div className="min-w-[320px] max-w-[480px] mx-auto px-4 py-6 min-h-screen bg-uni-white">
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
        <button>❤️</button>
      </div>

      <PostActions post={post} />

      {/* 가격 */}
      <p className="text-14 text-uni-gray-400 mb-4">
        {post?.extra?.price != null ? `${Number(post?.extra.price).toLocaleString()}원` : "가격 정보 없음"}
      </p>

      {/* 작성자 */}
      <div className="flex items-center gap-3 mb-2">
        <Image src="/img/profile.png" alt="" width={56} height={56} className="rounded-full" />
        <div>
          <p className="text-16">{post?.user.name}</p>
          <p className="text-14 text-uni-gray-300">{post?.extra.location}</p>
        </div>
      </div>

      {/* 상태 */}
      <span className="inline-block px-3 py-1 bg-uni-green-400 text-uni-white text-14 font-bold rounded-[12px] mb-4 p-10">
        {post?.extra.crt}
      </span>

      {/* 설명 */}
      <p className="text-gray-700 mb-2">{post?.content}</p>
      <p className="text-12 text-uni-gray-400 mb-6">{post?.createdAt}</p>
      {post?._id && Number.isInteger(post._id) && <CommentList _id={post._id} />}
    </div>
  );
}
