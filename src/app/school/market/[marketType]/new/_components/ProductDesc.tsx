// 상품 설명 입력 컴포넌트
export default function ProductDesc() {
  return (
    <section className="mb-5">
      <div className="mb-5">
        <label htmlFor="category" className="sr-only">
          카테고리
        </label>
        {/* 카테고리 셀렉트 */}
        <select
          id="category"
          name="category"
          className="w-full bg-uni-gray-200 rounded-lg p-3 text-16 text-uni-gray-600"
        >
          <option value="">카테고리</option>
          <option value="음식">음식</option>
          <option value="서적">서적</option>
          <option value="생활용품">생활용품</option>
          <option value="학용품">학용품</option>
        </select>
      </div>
      <div className="mb-5">
        <label htmlFor="desc" className="sr-only">
          상품 설명
        </label>
        <textarea
          id="desc"
          name="content"
          placeholder="상품 설명"
          className="w-full h-[150px] bg-uni-gray-200 rounded-lg p-3 text-16"
          maxLength={250}
        />
      </div>
      <div className="mb-5">
        <label htmlFor="price" className="sr-only">
          가격
        </label>
        <input
          id="price"
          name="price"
          type="text"
          placeholder="가격"
          className="w-full bg-uni-gray-200 rounded-lg p-3 text-16"
        />
      </div>
      <div className="mb-5">
        <label htmlFor="location" className="sr-only">
          거래장소
        </label>
        <input
          type="text"
          name="location"
          placeholder="거래 장소"
          className="w-full bg-uni-gray-200 rounded-lg p-3 text-16"
        />
      </div>
    </section>
  );
}
