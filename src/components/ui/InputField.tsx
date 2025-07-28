"use client";

import React from "react";

interface InputFieldProps {
  label: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  readOnly?: boolean;
  error?: string;
  required?: boolean;
  type?: string;
  disabled?: boolean;
}

export default function InputField({
  label,
  value,
  onChange,
  placeholder,
  readOnly = false,
  error,
  required = false,
  type = "text",
  disabled = false,
}: InputFieldProps) {
  return (
    <div className="mb-6">
      <label className="block text-14 font-medium text-uni-black mb-2 font-pretendard">
        {label}
        {required && <span className="text-uni-red-300"> *</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        disabled={disabled}
        className={`
          w-full px-4 py-3 text-16 bg-uni-gray-200 rounded-lg border-0
          placeholder-uni-gray-300 focus:outline-none font-pretendard
          ${readOnly || disabled ? "cursor-not-allowed text-uni-gray-300 focus:ring-0" : "text-uni-black focus:ring-2"}
          ${!readOnly && !disabled && error ? "focus:ring-uni-red-300" : ""}
          ${!readOnly && !disabled && !error ? "focus:ring-uni-blue-400" : ""}
        `}
      />
      {error && <p className="mt-1 text-14 text-uni-red-300 font-pretendard">{error}</p>}
    </div>
  );
}
