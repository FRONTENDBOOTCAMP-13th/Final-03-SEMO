export default function CommentNew() {
  return (
    <div className="min-w-[320px] max-w-[480px]">
      {/* 댓글 */}
      <div>
        <h3 className="font-bold text-22 mt-5 mb-2">댓글 (2)</h3>
        <input
          placeholder="댓글을 입력하세요"
          className="w-full bg-uni-gray-200 rounded-md p-3 mb-8 text-16"
        />
      </div>
    </div>
  )
}