import CommentItem from "./CommentItem";
import CommentNew from "./CommentNew";

export default function CommentList() {
  return (
    <div className="min-w-[320px] max-w-[480px]">
      <h3 className="font-bold text-22 mt-5 mb-2">댓글 (2)</h3>
      <CommentNew />
      <CommentItem />
    </div>
  );
}
