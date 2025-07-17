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

  // (닉네임/계쫘번호/이미지) 입력 핸들러
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("파일 크기는 5MB 이하만 업로드 가능합니다.");
        return;
      }
      if (!file.type.startsWith("image/")) {
        alert("이미지 파일만 업로드 가능합니다.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageRemove = () => {
    setProfileImage(null);
  };

  // 저장 핸들러
  const handleSave = () => {
    const bankError = validateBankSelection(selectedBank);
    const nicknameValidationError = validateNickname(nickname);
    const accountValidationError = validateAccountNumber(accountNumber);
    if (bankError || nicknameValidationError || accountValidationError) {
      alert(bankError || nicknameValidationError || accountValidationError);
      return;
    }
    console.log("저장 데이터:", {
      nickname: nickname.trim(),
      bank: selectedBank,
      accountNumber,
      profileImage: profileImage ? "업로드된 이미지" : "기본 이미지",
    });
  };

  // 탈퇴 핸들러ㅌ
  const handleWithdraw = () => {
    console.log("탈퇴하기 버튼 클릭");
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="px-4 py-6">
        <p>계정 설정 페이지</p>
      </div>
    </div>
  );
}
