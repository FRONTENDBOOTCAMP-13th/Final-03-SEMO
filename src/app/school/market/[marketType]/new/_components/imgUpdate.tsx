"use client";
import React, { useRef } from "react";
import { Plus, X } from "lucide-react";
import { uploadFile } from "@/app/api/market/action/file";
import { getImageUrl } from "@/app/api/market/action/file";

interface PhotoUploadProps {
  images: string[];
  setImages: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function PhotoUpload({ images, setImages }: PhotoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    try {
      const formData = new FormData();
      formData.append("attach", file);
      const result = await uploadFile(formData);

      if (result.ok) {
        setImages([result.item[0].path]);
      } else {
        console.error("파일 업로드 실패");
      }
    } catch (err) {
      console.error("업로드 실패", err);
    }
  }

  // 이미지 삭제 함수
  const removeImage = () => {
    setImages([]);
  };

  return (
    <div className="mb-5">
      <label htmlFor="item-image" className="sr-only">
        사진 추가
      </label>
      {images.length === 0 ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="w-full bg-uni-gray-200 rounded-lg p-3 flex items-center cursor-pointer"
        >
          <Plus className="w-5 h-5 text-uni-gray-500 mr-2" />
          <span className="text-uni-gray-600 text-16">사진 추가</span>
        </div>
      ) : (
        <div className="relative w-full h-48 bg-uni-gray-100 rounded-md overflow-hidden">
          {/* 
          왜 img 태그를 사용했는가? -> 
          이 코드에서는 Data URL을 사용하여 이미 이미지를 압축시켰기 때문에 Next.js의 Image를 사용할 필요가 없다고 판단함  */}
          <img src={getImageUrl(images[0])} alt="사진" className="w-full h-full object-cover" />

          {/* 삭제 버튼 */}
          <button
            type="button"
            onClick={removeImage}
            className="absolute top-2 right-2 w-8 h-8 bg-uni-black bg-opacity-50 rounded-full flex items-center justify-center hover:bg-opacity-70"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      )}

      <input
        ref={fileInputRef}
        id="item-image"
        name="product.image"
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="hidden"
      />
    </div>
  );
}
