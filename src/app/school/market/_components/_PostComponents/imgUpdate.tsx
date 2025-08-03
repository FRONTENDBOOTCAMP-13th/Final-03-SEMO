"use client";
import React, { useRef, useState } from "react";
import { X, Camera } from "lucide-react";
import Image from "next/image";
import { uploadFile } from "@/data/actions/file";
import { getImageUrl } from "@/data/actions/file";

interface PhotoUploadProps {
  images: string[]; // 업로드된 이미지 URL 배열
  setImages: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function PhotoUpload({ images, setImages }: PhotoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // 사진 파일 선택 객체
    const file = files[0];

    // 미리보기 만들기(서버 업로드 X)
    const localUrl = URL.createObjectURL(file); // 브라우저 미리보기용 임시 URL
    setPreviewUrl(localUrl);

    /**
     * 1. local에서 이미지 미리보기 preview
     * 2. 서버 업로드
     * 3. 응답받은 URL로 대체하기
     * 4. preview 제거(서버 이미지로 대체됨)
     */
    try {
      const formData = new FormData();
      formData.append("attach", file); // 서버 전송
      const result = await uploadFile(formData); // 비동기 서버 요청

      if (result.ok) {
        setImages([result.item[0].path]); // 서버에서 받은 이미지 경로
        URL.revokeObjectURL(localUrl); // 브라우저 메모리 해제함
        setPreviewUrl(null); // 기존 미리보기 preview 제거
      } else {
        console.error("파일 업로드 실패");
        URL.revokeObjectURL(localUrl);
        setPreviewUrl(null);
      }
    } catch (err) {
      console.error("업로드 실패", err);
    }
  }

  // 이미지 삭제 함수
  const removeImage = () => {
    setImages([]); // 이미지 리스트 비움
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl); // 메모리 정리
      setPreviewUrl(null);
    }
  };
  const displayUrl = previewUrl || (images.length > 0 ? getImageUrl(images[0]) : null);

  return (
    <div className="mb-5">
      <label htmlFor="item-image" className="sr-only">
        사진 추가
      </label>
      {!displayUrl ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="w-full bg-uni-gray-100 rounded-lg p-4 flex items-center cursor-pointer"
        >
          <Camera className="w-5 h-5 text-uni-gray-500 mr-2" />
          <span className="text-uni-gray-300 text-16">사진 추가</span>
        </div>
      ) : (
        <div className="relative w-full h-48 bg-uni-gray-100 rounded-md overflow-hidden">
          <Image
            src={displayUrl}
            alt="업로드된 사진"
            className="w-full h-full object-cover"
            width={500}
            height={192}
            unoptimized={true}
          />

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
