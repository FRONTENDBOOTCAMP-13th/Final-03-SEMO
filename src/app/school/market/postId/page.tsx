'use client';
import Image from 'next/image';

export default function BuyMarketPostPage() {
  return (
    <div className="min-w-[320px] max-w-[480px] mx-auto px-4 py-6 min-h-screen bg-uni-white">

      {/* 이미지 */}
      <div className="rounded-lg overflow-hidden mb-4 bg-uni-gray-100">
        <Image
          src="/"
          alt=""
          width={350}
          height={300}
          className="w-full h-auto object-cover"
        />
      </div>

      {/* 제목 + 좋아요 */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-bold text-22">신라면 미개봉 팝니다</h2>
        <button>❤️</button>
      </div>

      {/* 가격 */}
      <p className="text-14 text-uni-gray-400 mb-4">10,000원</p>

      {/* 작성자 */}
      <div className="flex items-center gap-3 mb-2">
        <Image src="/img/profile.png" alt="" width={56} height={56} className="rounded-full" />
        <div>
          <p className="text-16">김민지</p>
          <p className="text-14 text-uni-gray-300">행복 기숙사</p>
        </div>
      </div>

      {/* 상태 */}
      <span className="inline-block px-3 py-1 bg-uni-green-400 text-uni-white text-14 font-bold rounded-[12px] mb-4 p-10">판매중</span>

      {/* 설명 */}
      <p className="text-gray-700 mb-2">미개봉 새상품입니다. 쿨거래시 네고 가능합니다.</p>
      <p className="text-12 text-uni-gray-400 mb-6">2025년 07월 09일 11:34시</p>

      {/* 댓글 */}
      <div>
        <h3 className="font-bold text-22 mt-5 mb-2">댓글 (2)</h3>
        <input
          placeholder="댓글을 입력하세요"
          className="w-full bg-uni-gray-200 rounded-md p-3 mb-8 text-16"
        />
        
        {/* 댓글 리스트 */}
        <div className="space-y-3">
          <div className="flex gap-2 items-start">
            <Image src="/" alt="" width={24} height={24} className="rounded-full" />
            <div className="flex-1">
              <p className="text-14 font-bold">박지수 <span className="text-14 text-uni-gray-300 font-medium ml-2">2025년 07월 09일</span></p>
              <p className="text-14">네고 가능한가요?</p>
            </div>
          </div>
          <div className="flex gap-2 items-start">
            <Image src="/" alt="" width={24} height={24} className="rounded-full" />
            <div className="flex-1">
              <p className="text-14 font-bold">김민지 <span className="text-14 text-uni-gray-300 font-medium ml-2">2025년 07월 09일</span></p>
              <p className="text-14">네 가능합니다.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}