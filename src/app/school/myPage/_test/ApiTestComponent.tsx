/**
 * MyPageApiService 단위 테스트
 * (실제 Jest 환경에서 실행되는 것을 가정하며, fetch mocking을 포함합니다.)
 */

import MyPageApiService, { User, LoginResponse, ApiResponse } from "../_services/apiService";

// fetch API를 모킹합니다.
const mockFetch = (data: any, ok: boolean = true, status: number = 200) => {
  return jest.fn().mockResolvedValue({
    ok: ok,
    status: status,
    json: () => Promise.resolve(data),
    blob: () => Promise.resolve(new Blob([JSON.stringify(data)], { type: "application/json" })),
  });
};

describe("MyPageApiService", () => {
  // 각 테스트 전에 토큰 및 사용자 정보 초기화
  beforeEach(() => {
    // @ts-ignore: private 속성에 접근하여 초기화
    MyPageApiService["token"] = null;
    // @ts-ignore: private 속성에 접근하여 초기화
    MyPageApiService["currentUser"] = null;
    localStorage.clear(); // localStorage 초기화
    jest.spyOn(global, "fetch").mockRestore(); // 이전 fetch mock 복원
  });

  // 로그인 테스트
  test("login: should successfully log in and store token/user info", async () => {
    const mockLoginResponse: LoginResponse = {
      ok: 1,
      item: {
        _id: 1,
        email: "test@example.com",
        name: "Test User",
        type: "user",
        token: {
          accessToken: "mock_access_token",
          refreshToken: "mock_refresh_token",
        },
      },
    };

    global.fetch = mockFetch(mockLoginResponse);

    const result = await MyPageApiService.login("test@example.com", "password");

    expect(result).toEqual(mockLoginResponse);
    // @ts-ignore
    expect(MyPageApiService["token"]).toBe("mock_access_token");
    // @ts-ignore
    expect(MyPageApiService["currentUser"]).toEqual(expect.objectContaining({ _id: 1, email: "test@example.com" }));
    expect(localStorage.getItem("accessToken")).toBe("mock_access_token");
    expect(localStorage.getItem("currentUser")).toBe(JSON.stringify(mockLoginResponse.item));
  });

  // 사용자 정보 조회 테스트
  test("getUserById: should fetch user data successfully", async () => {
    const mockUser: User = {
      _id: 1,
      email: "test@example.com",
      name: "Test User",
      type: "user",
      image: "files/client-id/test.jpg",
    };
    const mockApiResponse: ApiResponse<User> = { ok: 1, item: mockUser };

    global.fetch = mockFetch(mockApiResponse);
    // 토큰 설정 (getUserById는 토큰이 필요합니다)
    MyPageApiService.setToken("dummy_token");

    const user = await MyPageApiService.getUserById(1);

    expect(user).toEqual(
      expect.objectContaining({
        _id: 1,
        email: "test@example.com",
        image: expect.stringContaining("http"), // URL로 변환되었는지 확인
      })
    );
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/users/1"),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer dummy_token",
        }),
      })
    );
  });

  // 사용자 정보 업데이트 테스트
  test("updateUser: should update user data successfully", async () => {
    const updatedUser: User = {
      _id: 1,
      email: "test@example.com",
      name: "Test User",
      type: "user",
      extra: { nickname: "Updated Nick" },
    };
    const mockApiResponse: ApiResponse<User> = { ok: 1, item: updatedUser };

    global.fetch = mockFetch(mockApiResponse);
    MyPageApiService.setToken("dummy_token");

    const result = await MyPageApiService.updateUser(1, { extra: { nickname: "Updated Nick" } });

    expect(result).toEqual(updatedUser);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/users/1"),
      expect.objectContaining({
        method: "PATCH",
        body: JSON.stringify({ extra: { nickname: "Updated Nick" } }),
      })
    );
  });

  // 파일 업로드 테스트
  test("uploadFile: should upload a file and return its URL", async () => {
    const mockFile = new File(["dummy content"], "test.jpg", { type: "image/jpeg" });
    const mockUploadResponse: ApiResponse<Array<{ path: string }>> = {
      ok: 1,
      item: [{ path: "files/client-id/uploaded_test.jpg" }],
    };

    // compressImage 내부에서 fetch(dataUrl) 호출을 모킹해야 합니다.
    // 여기서는 간단히 compressImage가 data:image/jpeg;base64,... 형태의 문자열을 반환한다고 가정합니다.
    jest.spyOn(MyPageApiService as any, "compressImage").mockResolvedValue("data:image/jpeg;base64,mockbase64data");
    global.fetch = mockFetch(mockUploadResponse);
    MyPageApiService.setToken("dummy_token");

    const imageUrl = await MyPageApiService.uploadFile(mockFile);

    expect(imageUrl).toBe(`${process.env.NEXT_PUBLIC_API_URL}/files/client-id/uploaded_test.jpg`);
    expect(MyPageApiService["compressImage"]).toHaveBeenCalledWith(mockFile);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/files/"),
      expect.objectContaining({
        method: "POST",
        body: expect.any(FormData), // FormData가 전송되었는지 확인
      })
    );
  });

  // 에러 처리 테스트
  test("login: should throw an error on API failure", async () => {
    const mockErrorResponse: LoginResponse = { ok: 0, message: "Invalid credentials" } as LoginResponse;
    global.fetch = mockFetch(mockErrorResponse, false, 401);

    await expect(MyPageApiService.login("wrong@example.com", "wrong")).rejects.toThrow("Invalid credentials");
  });
});
