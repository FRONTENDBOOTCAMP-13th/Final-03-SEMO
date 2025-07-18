"use client";
import React, { useState, useRef } from "react";
import { Plus, X, ChevronLeft, ChevronRight } from "lucide-react";

export default function PhotoUpload() {
  const [images, setImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setImages((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = () => {
    setImages((prev) => {
      const newImages = prev.filter((_, index) => index !== currentIndex);
      if (currentIndex >= newImages.length && newImages.length > 0) {
        setCurrentIndex(newImages.length - 1);
      } else if (newImages.length === 0) {
        setCurrentIndex(0);
      }
      return newImages;
    });
  };

  const next = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="mb-5">
      <label htmlFor="item-image" className="sr-only">
        사진 추가
      </label>
      {images.length === 0 ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="w-full bg-uni-gray-200 rounded-md p-3 flex items-center cursor-pointer"
        >
          <Plus className="w-5 h-5 text-uni-gray-500 mr-2" />
          <span className="text-uni-gray-600 text-16">사진 추가</span>
        </div>
      ) : (
        <div className="relative w-full h-48 bg-uni-gray-100 rounded-md overflow-hidden">
          <img src={images[currentIndex]} alt="사진" className="w-full h-full object-cover" />

          {/* 삭제 버튼 */}
          <button
            onClick={removeImage}
            className="absolute top-2 right-2 w-8 h-8 bg-black bg-opacity-50 rounded-full flex items-center justify-center hover:bg-opacity-70"
          >
            <X className="w-4 h-4 text-white" />
          </button>

          {/* 화살표 */}
          {images.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center bg-black bg-opacity-50 hover:bg-opacity-70"
              >
                <ChevronLeft className="w-4 h-4 text-white" />
              </button>

              <button
                onClick={next}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center bg-black bg-opacity-50 hover:bg-opacity-70"
              >
                <ChevronRight className="w-4 h-4 text-white" />
              </button>
            </>
          )}

          {/* 점 표시 */}
          {images.length > 1 && (
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full ${index === currentIndex ? "bg-white" : "bg-white bg-opacity-50"}`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        id="item-image"
        name="product.image"
        type="file"
        multiple
        accept="image/*"
        onChange={handleUpload}
        className="hidden"
      />
    </div>
  );
}
