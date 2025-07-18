// 상품 정보 컴포넌트

import PhotoUpload from "./imgUpdate";
export default function Product() {
  return (
    <section>
      <h1 className="sr-only">상품 등록</h1>
      <div className="mb-5">
        <label htmlFor="item-name" className="sr-only">
          상품명
        </label>
        <input
          id="item-name"
          name="title"
          type="text"
          placeholder="상품명"
          className="w-full bg-uni-gray-200 rounded-md p-3 text-16"
        />
      </div>
      <div className="mb-5">
        {/* <input
          id="item-image"
          type="text"
          placeholder="사진 추가"
          className="w-full bg-uni-gray-200 rounded-md p-3 text-16"
        /> */}
        <PhotoUpload />
      </div>
    </section>
  );
}
