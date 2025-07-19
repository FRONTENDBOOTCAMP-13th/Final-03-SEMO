import Image from "next/image";
// import Link from "next/link";

export default function CommentItem() {
  return (
    <div>
      {/* 댓글 리스트 */}
      <div className="space-y-3">
        <div className="flex gap-2 items-start">
          <Image src="/" alt="" width={24} height={24} className="rounded-full" />
          <div className="flex-1">
            <p className="text-14 font-bold">
              박지수 <span className="text-14 text-uni-gray-300 font-medium ml-2">2025년 07월 09일</span>
            </p>
            <p className="text-14">네고 가능한가요?</p>
          </div>
        </div>
        <div className="flex gap-2 items-start">
          <Image src="/" alt="" width={24} height={24} className="rounded-full" />
          <div className="flex-1">
            <p className="text-14 font-bold">
              김민지 <span className="text-14 text-uni-gray-300 font-medium ml-2">2025년 07월 09일</span>
            </p>
            <p className="text-14">네 가능합니다.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
