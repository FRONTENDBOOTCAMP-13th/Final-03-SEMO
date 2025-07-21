// 상품 정보 컴포넌트

import PhotoUpload from "./imgUpdate";
interface ProductProps {
  images: string[];
  initialTitle?: string;
  setImages: React.Dispatch<React.SetStateAction<string[]>>; // 이미지 상태 변경 함수
}
export default function Product({ images, initialTitle, setImages }: ProductProps) {
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
          defaultValue={initialTitle || ""}
          className="w-full bg-uni-gray-200 rounded-lg p-3 text-16"
        />
      </div>
      <div className="mb-5">
        <PhotoUpload images={images} setImages={setImages} />
      </div>
    </section>
  );
}
