// 상품 설명 입력 컴포넌트
import { Post } from "@/types";
import { ChevronsUpDown } from "lucide-react";
interface ProductDescProps {
  initialData?: Post;
  contentError: string;
}

/*
 * 수정 모드에서 initialData를 Props로 받아와서
 * 해당 데이터를 초기값으로 설정
 * 만약 초기값이 없다면 옵셔널로 세팅해서 문제 없이 동작
 */

export default function ProductDesc({ initialData, contentError }: ProductDescProps) {
  return (
    <section className="mb-5">
      <div className="mb-5">
        <label htmlFor="category" className="sr-only">
          카테고리
        </label>
        {/* 카테고리 셀렉트 */}
        <p className="text-15 mb-1 text-uni-gray-600 font-bold">카테고리</p>
        <div className="relative">
          <select
            id="tag"
            name="tag"
            defaultValue={initialData?.tag || ""}
            className="w-full h-14 bg-uni-gray-200 rounded-lg p-3 text-16 text-uni-gray-300 appearance-none"
          >
            <option value="">카테고리</option>
            <option value="식품">식품</option>
            <option value="도서">도서</option>
            <option value="의류">의류</option>
            <option value="생활용품">생활용품</option>
            <option value="생활가전">생활가전</option>
            <option value="학용품">학용품</option>
            <option value="기타">기타</option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <ChevronsUpDown size={25} className="text-uni-gray-600" />
          </div>
        </div>
      </div>
      <div className="mb-5">
        <label htmlFor="desc" className="sr-only">
          상품 설명
        </label>
        <p className="text-15 mb-1 text-uni-gray-600 font-bold">상품 설명</p>
        <textarea
          id="desc"
          name="content"
          placeholder={`판매 금지 물품은 게시가 제한될 수 있어요\n(10글자 이상 입력)`}
          defaultValue={initialData?.content || ""}
          className={`w-full h-[150px] bg-uni-gray-200 rounded-lg p-3 text-16 placeholder-uni-gray-300${
            contentError ? "border-2 border-uni-red-500" : ""
          }`}
          maxLength={250}
        />
        {/* 에러 메시지 표시 */}
        {contentError && <p className=" text-14 text-uni-red-500 font-medium">{contentError}</p>}
      </div>
      <div className="mb-5">
        <label htmlFor="price" className="sr-only">
          가격
        </label>
        <p className="text-15 mb-1 text-uni-gray-600 font-bold">가격(원)</p>
        <input
          id="price"
          name="price"
          type="text"
          defaultValue={initialData?.extra.price || ""}
          placeholder="숫자만 입력 (',' 없이)"
          className="w-full bg-uni-gray-100 rounded-lg p-4 text-16 placeholder-uni-gray-300"
        />
      </div>
      <div className="mb-5">
        <label htmlFor="location" className="sr-only">
          거래장소
        </label>
        <p className="text-15 mb-1 text-uni-gray-600 font-bold">거래 희망 장소</p>
        <input
          type="text"
          name="location"
          placeholder="거래 장소"
          defaultValue={initialData?.extra.location || ""}
          className="w-full bg-uni-gray-100 rounded-lg p-4 text-16 placeholder-uni-gray-300"
        />
      </div>
    </section>
  );
}
