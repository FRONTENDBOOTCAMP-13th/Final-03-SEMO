"use client";

import { useState } from "react";

export default function MyPageAccount() {
  const [nickname, setNickname] = useState("김세모");
  const [selectedBank, setSelectedBank] = useState("국민은행");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountError, setAccountError] = useState("");
  const [nicknameError, setNicknameError] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>("");

  const userId = "semo2024@university.ac.kr";
  const banks = ["은행사", "국민은행", "신한은행", "우리은행", "하나은행", "농협은행", "기업은행"];

  // (닉네임/계쫘번호) 입력 핸들러
  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNickname(value);
    const error = validateNickname(value);
    setNicknameError(error);
  };

  const handleAccountNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAccountNumber(value);
    const error = validateAccountNumber(value);
    setAccountError(error);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="px-4 py-6">
        <p>계정 설정 페이지</p>
      </div>
    </div>
  );
}
