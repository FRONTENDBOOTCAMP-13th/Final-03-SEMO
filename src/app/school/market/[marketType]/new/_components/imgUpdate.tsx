"use client";
import React, { useRef } from "react";
import { Plus, X } from "lucide-react";

interface PhotoUploadProps {
  images: string[];
  setImages: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function PhotoUpload({ images, setImages }: PhotoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 이미지 압축
  const compressImage = (file: File, maxWidth = 800, quality = 0.8): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;
      const img = new Image();

      img.onload = () => {
        // 비율 유지하면서 크기 조정
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const compressedDataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(compressedDataUrl);
      };

      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    try {
      const compressedImage = await compressImage(file);
      setImages([compressedImage]); // 기존 이미지 대체
    } catch (error) {
      console.error("이미지 압축 실패:", error);
      const reader = new FileReader();
      reader.onload = () => {
        setImages([reader.result as string]);
      };
      reader.readAsDataURL(file);
    }
  };

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
          <img src={images[0]} alt="사진" className="w-full h-full object-cover" />

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
