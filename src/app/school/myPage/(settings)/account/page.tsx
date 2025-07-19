"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import SaveFloatingButton from "../../_components/SaveFloatingButton";
import InputField from "../../_components/InputField";
import { validateNickname, validateAccountNumber, validateBankSelection } from "./utils/validation";
import { useMyPageApi } from "../../_hooks/useMyPageApi";
import MyPageApiService from "../../_services/apiService";
import type { User } from "../../_types/user";

export default function MyPageAccount() {
  const [nickname, setNickname] = useState("김세모");
  const [selectedBank, setSelectedBank] = useState("국민은행");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountError, setAccountError] = useState("");
  const [nicknameError, setNicknameError] = useState("");
  // 프로필 사진 미리보기용 URL
  const [profileImage, setProfileImage] = useState<string | null>("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [userData, setUserData] = useState<User | null>(null);
  // 사용자가 새로 선택한 업로드할 이미지 파일을 저장하는 상태
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  // 현재 로그인한 사용자의 이메일 상태
  const [userEmail, setUserEmail] = useState<string>("");

  const { getUserProfile, updateUserProfile, uploadProfileImage, loading } = useMyPageApi();
  const banks = ["은행사", "국민은행", "신한은행", "우리은행", "하나은행", "농협은행", "기업은행"];

  // 컴포넌트 마운트 시 사용자 데이터 로드
  useEffect(() => {
    const loadUserData = async () => {
      const currentUserId = MyPageApiService.getCurrentUserId();
      if (!currentUserId) {
        // 사용자에게 알림 대신, 로그인 페이지로 리다이렉트하거나 다른 처리
        console.warn("로그인이 필요합니다.");
        return;
      }

      const user = await getUserProfile(currentUserId);
      if (user) {
        setUserData(user);
        setUserEmail(user.email); // 실제 로그인한 사용자의 이메일 설정
        setNickname(user.extra?.nickname || user.name);
        setSelectedBank(user.extra?.bank || "은행사");
        setAccountNumber(user.extra?.bankNumber ? String(user.extra.bankNumber) : "");
        if (user.image && typeof user.image === "string" && user.image !== "undefined" && user.image.trim() !== "") {
          setProfileImage(user.image);
        } else {
          setProfileImage(null);
        }
      }
    };
    loadUserData();
  }, [getUserProfile]);

  // 이미지 URL을 메모이제이션하여 불필요한 재생성 방지
  const memoizedImageUrl = useMemo(() => {
    if (
      profileImage &&
      typeof profileImage === "string" &&
      profileImage !== "undefined" &&
      profileImage.trim() !== ""
    ) {
      return profileImage;
    }
    return null;
  }, [profileImage]);

  // 이미지 렌더링을 메모이제이션하여 불필요한 요청 방지
  const imageElement = useMemo(() => {
    if (memoizedImageUrl) {
      return (
        <Image
          src={memoizedImageUrl}
          alt="프로필 이미지"
          fill
          className="object-cover"
          unoptimized
          priority
          onError={() => {
            setProfileImage(null);
          }}
        />
      );
    }
    return (
      <svg className="w-14 h-14 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
      </svg>
    );
  }, [memoizedImageUrl]);

  {
    /*(닉네임/계쫘번호/이미지) 입력 핸들러*/
  }
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
    // 이 부분은 다음 커밋에서 구현됩니다.
    console.log("handleImageUpload 호출됨 (아직 구현되지 않음)");
  };

  const handleImageRemove = () => {
    // 이 부분은 다음 커밋에서 구현됩니다.
    console.log("handleImageRemove 호출됨 (아직 구현되지 않음)");
  };

  // 저장 핸들러 (아직 구현되지 않음)
  const handleSave = async () => {
    console.log("handleSave 호출됨 (아직 구현되지 않음)");
  };

  // 탈퇴 핸들러 (아직 구현되지 않음)
  const handleWithdraw = () => {
    console.log("탈퇴하기 버튼 클릭");
  };

  return (
    <div className="min-h-screen bg-uni-white">
      <div className="px-4 py-6">
        {/* 프로필 이미지 */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative group">
            <div className="w-28 h-28 bg-gradient-to-br from-uni-gray-200 to-uni-gray-300 rounded-full flex items-center justify-center overflow-hidden relative border-4 border-uni-white shadow-lg">
              {profileImage ? (
                <Image src={profileImage} alt="프로필 이미지" fill className="object-cover" />
              ) : (
                <svg className="w-14 h-14 text-uni-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              )}

              {/* 호버 오버레이 */}
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-full">
                <svg className="w-8 h-8 text-uni-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
            </div>

            {/* 숨겨진 파일 입력 */}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />

            {/* 이미지 제거 버튼 (이미지가 있을 때만 표시) */}
            {profileImage && (
              <button
                onClick={handleImageRemove}
                className="absolute -top-1 -right-1 w-8 h-8 bg-uni-red-500 rounded-full flex items-center justify-center hover:bg-uni-red-600 transition-colors shadow-lg border-2 border-uni-white"
              >
                <svg className="w-4 h-4 text-uni-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* 업로드 안내 텍스트 */}
          <div className="mt-3 text-center">
            <p className="text-14 text-uni-gray-600 mb-1 font-pretendard">프로필 사진</p>
            <p className="text-12 text-uni-gray-400 font-pretendard">
              {profileImage ? "사진을 클릭하여 변경하거나 X를 눌러 삭제하세요" : "사진을 클릭하여 업로드하세요"}
            </p>
          </div>
        </div>

        {/* 아이디 섹션 (읽기 전용)(inputField 컴포넌트 사용) */}
        <div className="mb-6">
          <InputField label="아이디" value={userId} readOnly />
        </div>

        {/* 닉네임 섹션 (inputField 컴포넌트 사용)
        1-1. 입력 중 실시간 검사*/}
        <div className="mb-6">
          <InputField
            label="닉네임"
            value={nickname}
            onChange={handleNicknameChange}
            placeholder="닉네임을 입력해주세요"
            error={nicknameError}
            required
          />
          <p className="-mt-5 text-12 text-uni-gray-500 font-pretendard">* 2-10글자로 입력해주세요.</p>
        </div>

        {/* 계좌번호 섹션 */}
        <div className="mb-8">
          <label className="block text-14 font-medium text-uni-black mb-2 font-pretendard">
            계좌번호 <span className="text-uni-red-300">*</span>
          </label>
          <div className="space-y-3">
            {/* 은행 선택 드롭다운 */}
            <div className="relative">
              <select
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
                className="w-full px-4 py-3 bg-uni-gray-200 rounded-lg border-0 text-uni-black focus:outline-none focus:ring-2 focus:ring-uni-blue-400 appearance-none cursor-pointer font-pretendard text-16"
              >
                {banks.map((bank) => (
                  <option key={bank} value={bank}>
                    {bank}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-uni-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* 계좌번호 입력 (inputField 컴포넌트 사용)
            1-2. 입력 중 실시간 검사*/}
            <InputField
              label=""
              value={accountNumber}
              onChange={handleAccountNumberChange}
              placeholder="계좌번호를 입력해주세요"
              error={accountError}
            />
          </div>
          <p className="-mt-5 text-12 text-uni-gray-500 font-pretendard">* 은행을 선택하고 계좌번호를 입력해주세요.</p>
        </div>

        {/* 탈퇴 섹션 */}
        <div className="mb-12">
          <label className="block text-14 font-medium text-uni-black mb-2 font-pretendard">탈퇴</label>
          <button
            onClick={handleWithdraw}
            className="w-full px-4 py-3 bg-uni-gray-200 rounded-lg text-left text-uni-black hover:bg-uni-gray-300 transition-colors flex items-center justify-between font-pretendard text-16"
          >
            <span>탈퇴하기</span>
            <svg className="w-5 h-5 text-uni-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* SaveFloatingButton 컴포넌트 사용 
      2. 최종 저장 시 검사*/}
      <SaveFloatingButton onClick={handleSave}>저장하기</SaveFloatingButton>
    </div>
  );
}
