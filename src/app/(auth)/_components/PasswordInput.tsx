"use client";

import { useState } from "react";
import Image from "next/image";

interface PasswordInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

export default function PasswordInput({ value, onChange, placeholder = "비밀번호 입력" }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full border border-uni-gray-200 rounded-md px-4 py-3 text-sm focus:outline-uni-blue-400 focus:border-uni-blue-400 bg-uni-gray-100"
      />
      <button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        tabIndex={-1}
        aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
        className="absolute right-3 top-1/2 transform -translate-y-1/2"
      >
        <Image src="/assets/eye.svg" alt="비밀번호 보기" width={20} height={20} />
      </button>
    </div>
  );
}
