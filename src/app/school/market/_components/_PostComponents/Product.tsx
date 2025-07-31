// 상품 정보 컴포넌트

import PhotoUpload from "./imgUpdate";
interface ProductProps {
  images: string[];
  initialTitle?: string;
  titleError: string;
  setImages: React.Dispatch<React.SetStateAction<string[]>>; // 이미지 상태 변경 함수
}
export default function Product({ images, initialTitle, setImages, titleError }: ProductProps) {
  return (
    <section>
      <h1 className="sr-only">상품 등록</h1>
      <div className="mb-5">
        <label htmlFor="item-name" className="sr-only">
          상품명
        </label>
        <p className="text-15 mb-1 text-uni-gray-600 font-bold">상품명</p>
        <input
          id="item-name"
          name="title"
          type="text"
          placeholder="상품명 입력(2글자 이상)"
          defaultValue={initialTitle || ""}
          className={`w-full bg-uni-gray-100 rounded-lg p-4 text-16 placeholder-uni-gray-300${titleError ? "border-2 border-uni-red-500" : ""}`}
        />
        {/* 에러 메시지 표시 */}
        {titleError && <p className=" text-14 text-uni-red-500 font-medium">{titleError}</p>}
      </div>
      <div className="mb-5">
        <PhotoUpload images={images} setImages={setImages} />
      </div>
    </section>
  );
}
