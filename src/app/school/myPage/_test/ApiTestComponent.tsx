/**
 * API 테스트 컴포넌트 (개선된 버전)
 * 개발 및 테스트 목적으로만 사용
 */

"use client";

import { useState } from "react";
import Image from "next/image";
import { useMyPageApi } from "../_hooks/useMyPageApi";
import MyPageApiService from "../_services/apiService";
import type { User } from "@/app/school/myPage/_types/user";

export default function ApiTestComponent() {
  const [loginData, setLoginData] = useState({
    email: "parksw003@soongsil.ac.kr",
    password: "030101",
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<User | null>(null);

  const { loading, error, login, getUserProfile, updateUserProfile, uploadProfileImage } = useMyPageApi();

  // 현재 로그인한 사용자 ID 가져오기
  const getCurrentUserId = () => {
    return MyPageApiService.getCurrentUserId();
  };

  // 로그인 테스트
  const handleLogin = async () => {
    const success = await login(loginData.email, loginData.password);
    setIsLoggedIn(success);
  };

  // 사용자 정보 조회 테스트
  const handleGetUser = async () => {
    console.log("사용자 정보 조회 시작...");
    const currentUserId = getCurrentUserId();
    if (!currentUserId) {
      alert("로그인이 필요합니다.");
      return;
    }
    const user = await getUserProfile(currentUserId);
    console.log("조회된 사용자 정보:", user);
    if (user) {
      setUserData(user);
    }
  };

  // 사용자 정보 수정 테스트
  const handleUpdateUser = async () => {
    const currentUserId = getCurrentUserId();
    if (!currentUserId) {
      alert("로그인이 필요합니다.");
      return;
    }
    const success = await updateUserProfile(currentUserId, {
      nickname: "테스트 닉네임",
      bank: "국민은행",
      accountNumber: "123456789123",
      profileImage: userData?.image,
    });
    if (success) {
      alert("프로필 업데이트 성공!");
      handleGetUser(); // 업데이트된 정보 다시 가져오기
    }
  };

  // 이미지 업로드 테스트
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("이미지 업로드 시작:", file.name);
      const imageUrl = await uploadProfileImage(file);
      console.log("업로드된 이미지 URL:", imageUrl);

      if (imageUrl) {
        alert(`이미지 업로드 성공: ${imageUrl}`);
        // 업로드된 이미지로 프로필 업데이트 (일시적으로 주석 처리)
        /*
        await updateUserProfile(testUserId, {
          nickname: userData?.extra?.nickname || "테스트 닉네임",
          bank: userData?.extra?.bank || "국민은행",
          accountNumber: userData?.extra?.bankNumber?.toString() || "123456789123",
          profileImage: imageUrl,
        });
        handleGetUser(); // 업데이트된 정보 다시 가져오기
        */
      }
    }
    // 파일 input 초기화
    e.target.value = "";
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg space-y-4">
      <h2 className="text-xl font-bold text-gray-800">🧪 API 테스트 패널</h2>
      <div className="text-sm text-gray-600 bg-yellow-100 p-3 rounded">
        ⚠️ 이 컴포넌트는 개발/테스트 목적으로만 사용됩니다.
      </div>

      {/* 로딩 및 에러 표시 */}
      {loading && <div className="text-blue-600">⏳ 처리 중...</div>}
      {error && <div className="text-red-600 bg-red-50 p-3 rounded">❌ {error}</div>}

      {/* 로그인 섹션 */}
      <div className="bg-white p-4 rounded border">
        <h3 className="font-semibold mb-3">1. 로그인 테스트</h3>
        <div className="space-y-2">
          <input
            type="email"
            value={loginData.email}
            onChange={(e) => setLoginData((prev) => ({ ...prev, email: e.target.value }))}
            placeholder="이메일"
            className="w-full p-2 border rounded"
          />
          <input
            type="password"
            value={loginData.password}
            onChange={(e) => setLoginData((prev) => ({ ...prev, password: e.target.value }))}
            placeholder="비밀번호"
            className="w-full p-2 border rounded"
          />
          <button
            onClick={handleLogin}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            로그인
          </button>
          {isLoggedIn && <div className="text-green-600">✅ 로그인 성공!</div>}
        </div>
      </div>

      {/* 사용자 정보 조회 섹션 */}
      <div className="bg-white p-4 rounded border">
        <h3 className="font-semibold mb-3">2. 사용자 정보 조회 (현재 로그인한 사용자)</h3>
        <button
          onClick={handleGetUser}
          disabled={loading || !isLoggedIn}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
        >
          사용자 정보 가져오기
        </button>
        {userData ? (
          <div className="mt-3 p-3 bg-gray-50 rounded text-sm">
            <h4 className="font-semibold text-green-600 mb-2">✅ 사용자 정보 조회 성공!</h4>
            <pre>{JSON.stringify(userData, null, 2)}</pre>
          </div>
        ) : (
          <div className="mt-3 p-3 bg-gray-100 rounded text-sm text-gray-500">
            사용자 정보가 없습니다. 먼저 로그인 후 사용자 정보를 가져와 주세요.
          </div>
        )}
      </div>

      {/* 프로필 업데이트 섹션 */}
      <div className="bg-white p-4 rounded border">
        <h3 className="font-semibold mb-3">3. 프로필 업데이트 테스트</h3>
        <button
          onClick={handleUpdateUser}
          disabled={loading || !isLoggedIn || !userData}
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 disabled:opacity-50"
        >
          프로필 업데이트
        </button>
      </div>

      {/* 이미지 업로드 섹션 */}
      <div className="bg-white p-4 rounded border">
        <h3 className="font-semibold mb-3">4. 이미지 업로드 테스트</h3>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          disabled={loading || !isLoggedIn}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>

      {/* 현재 이미지 표시 */}
      {userData?.image &&
        typeof userData.image === "string" &&
        userData.image !== "undefined" &&
        userData.image.trim() !== "" && (
          <div className="bg-white p-4 rounded border">
            <h3 className="font-semibold mb-3">현재 프로필 이미지</h3>
            <Image
              src={userData.image}
              alt="Profile"
              width={128}
              height={128}
              className="w-32 h-32 object-cover rounded-full border"
              onError={() => {
                console.error("이미지 로드 실패:", userData.image);
                // 이미지 로드 실패시 userData에서 image 제거
                setUserData((prev) => (prev ? { ...prev, image: undefined } : null));
              }}
            />
          </div>
        )}
    </div>
  );
}
