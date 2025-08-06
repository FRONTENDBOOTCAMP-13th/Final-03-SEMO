import CommentItem from "./CommentItem";
import CommentNew from "./CommentNew";
import { getReplies } from "@/app/api/market/functions/post";
import { PostReply, Post } from "@/types";

interface CommentListProps {
  _id: number;
  post: Post;
}

export default async function CommentList({ _id, post }: CommentListProps) {
  const res = await getReplies(_id);
  return (
    <div className="min-w-[320px] max-w-[480px]">
      <h3 className="font-bold text-18 mt-5 mb-2">댓글 {res.ok ? res.item.length : 0}개</h3>

      <CommentNew _id={_id} />

      {/* 댓글 목록 렌더링 */}
      {res.ok && res.item.length > 0 ? (
        res.item.map((reply: PostReply) => <CommentItem key={reply._id} reply={reply} post={post} />)
      ) : (
        <p className="text-uni-gray-600 text-center py-4">댓글이 없습니다.</p>
      )}
    </div>
  );
}
