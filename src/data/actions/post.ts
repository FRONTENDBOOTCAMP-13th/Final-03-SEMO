"use server";
import { type ApiResPromise, type ApiRes, type Post, type PostReply } from "@/types";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || "";

/**
 * 게시글 작성 함수
 * @param postData - 게시글 데이터 객체
 * @returns 게시글 작성 결과를 반환하는 Promise
 */
export async function createPost(state: ApiRes<Post> | null, formData: FormData): ApiResPromise<Post> {
  const accessToken = formData.get("accessToken") as string;
  const type = formData.get("type") as string;

  if (!accessToken) {
    return { ok: 0, message: "로그인이 필요합니다." };
  }

  // FormData에서 데이터 추출
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const image = formData.get("image") as string;
  const tag = formData.get("tag") as string;
  const price = formData.get("price") as string;
  const location = formData.get("location") as string;

  // 게시글 데이터 구성
  const postData = {
    type,
    title,
    content,
    image,
    tag,
    extra: {
      price,
      location,
      crt: "판매중",
    },
  };
  try {
    console.log("게시글 등록 시작...");
    const postRes = await fetch(`${API_URL}/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Client-Id": CLIENT_ID,
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(postData),
    });

    const postResult = await postRes.json();
    console.log("게시글 등록 응답:", postResult);

    if (postResult.ok !== 1) {
      console.log("게시글 등록 실패:", postResult);
      return { ok: 0, message: `게시글 등록 실패: ${postResult.message || "Unknown error"}` };
    }

    console.log("게시글 등록 성공! 이제 상품 등록 시작...");

    // 2. 상품 등록
    console.log("상품 등록 시작...");
    console.log("상품 API URL:", `${API_URL}/seller/products`);

    const productData = {
      price: parseInt(price) || 0, // 정수로 변환
      quantity: 1, // 정수 1로 고정
      name: title, // 제목을 상품명으로
      content: content, // 내용을 상품 설명으로
      mainImages: image
        ? [
            {
              path: image,
              name: image.split("/").pop() || "product-image",
              originalname: image.split("/").pop() || "product-image",
            },
          ]
        : [],
      extra: {
        tag,
        location,
        marketType: type,
        crt: "판매중",
      },
    };

    const productRes = await fetch(`${API_URL}/seller/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Client-Id": CLIENT_ID,
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(productData),
    });

    console.log("상품 응답:", productRes.status, productRes.statusText);
    const productResult = await productRes.json();
    console.log("상품 등록 결과:", productResult);

    if (productResult.ok !== 1) {
      console.warn("상품 등록 실패:", productResult.message);
    } else {
      console.log("상품 등록 성공");
    }
  } catch (error) {
    console.error("오류 발생:", error);
    return { ok: 0, message: "등록 중 오류가 발생했습니다!!!!!!" };
  }
  redirect(`/school/market/${type}`);
}

/**
 * 게시글 수정 함수
 * @param postId - 수정할 게시글 ID
 * @param postData - 수정할 게시글 데이터 객체
 * @returns 게시글 수정 결과를 반환하는 Promise
 */
export async function updatePost(state: ApiRes<Post> | null, formData: FormData): ApiResPromise<Post> {
  const accessToken = formData.get("accessToken") as string;
  const postId = formData.get("postId") as string;
  const type = formData.get("type") as string;

  const postData = {
    type,
    title: formData.get("title") as string,
    content: formData.get("content") as string,
    image: formData.get("image") as string,
    tag: formData.get("tag") as string,
    extra: {
      price: formData.get("price") as string,
      location: formData.get("location") as string,
    },
  };

  let result: any;
  try {
    const res = await fetch(`${API_URL}/posts/${postId}`, {
      method: "PATCH", // 수정은 PATCH 메서드
      headers: {
        "Content-Type": "application/json",
        "Client-Id": CLIENT_ID,
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(postData),
    });

    result = await res.json();
  } catch (err) {
    console.error("게시글 수정 오류", err);
    return { ok: 0, message: "게시글 수정 중 오류 발생" };
  }
  if (result.ok) {
    revalidateTag(`posts/${postId}`);
    revalidateTag(`posts?type=${type}`);
    redirect(`/school/market/${type}/${postId}`);
  }
  return result;
}

/**
 * 게시글 삭제 함수
 * @param postId - 삭제할 게시글 Id
 *
 */

export async function deletePost(state: ApiRes<Post> | null, formData: FormData): ApiResPromise<Post> {
  const accessToken = formData.get("accessToken") as string;
  const postId = formData.get("postId") as string;
  const type = formData.get("type") as string;

  let res: Response;
  let data: ApiRes<{ ok: 0 | 1 }>;

  try {
    res = await fetch(`${API_URL}/posts/${postId}`, {
      method: "DELETE",
      headers: {
        "Client-Id": CLIENT_ID,
        Authorization: `Bearer ${accessToken}`,
      },
    });
    data = await res.json();
  } catch (err) {
    console.error("게시글 삭제 오류", err);
    return { ok: 0, message: "게시글 삭제 중 오류 발생" };
  }
  if (data.ok) {
    revalidatePath(`/school/market/${type}`);
    redirect(`/school/market/${type}`);
  } else {
    return data;
  }
}

/**
 * 댓글을 생성하는 함수
 * @param {ApiRes<PostReply> | null} state - 이전 상태(사용하지 않음)
 * @param {FormData} formData - 댓글 정보를 담은 FormData 객체
 * @returns {Promise<ApiRes<PostReply>>} - 생성 결과 응답 객체
 * @description
 * 댓글을 생성하고, 성공 시 해당 게시글의 댓글 목록을 갱신합니다.
 */

export async function createReply(
  state: ApiRes<PostReply[]> | null,
  formData: FormData,
  retryCount = 0
): ApiResPromise<PostReply[]> {
  const MAX_RETRIES = 10;

  const body = Object.fromEntries(formData.entries());
  // 폼 데이터 객체로 변환 FormData -> {content: '하이', _id:523}
  const accessToken = formData.get("accessToken") as string;
  // 토큰 가져오기

  let res: Response;
  let data: ApiRes<PostReply[]>;

  try {
    res = await fetch(`${API_URL}/posts/${body._id}/replies`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Client-Id": CLIENT_ID,
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });
    data = await res.json();

    if (!res.ok && retryCount < MAX_RETRIES) {
      console.warn(`createReply 실패, 재시도 ${retryCount + 1}/${MAX_RETRIES}`);
      await new Promise((resolve) => setTimeout(resolve, 1000 * (retryCount + 1)));
      return createReply(state, formData, retryCount + 1);
    }
  } catch (err) {
    console.log(err);
    return { ok: 0, message: "일시적인 네트워크 문제로 등록에 실패하였습니다." };
  }
  if (data.ok) {
    revalidatePath(`/market/${body._id}`); // 해당 게시글의 댓글 목록을 갱신(캐시 무효화)
  }
  return data;
}

/**
 * 댓글을 삭제하는 함수
 * @param {ApiRes<PostReply> | null} state - 이전 상태(사용하지 않음)
 * @param {FormData} formData - 삭제할 댓글 정보를 담은 FormData 객체
 * @returns {Promise<ApiRes<PostReply>>} - 삭제 결과 응답 객체
 * @description
 * 댓글을 삭제하고, 성공 시 해당 게시글의 댓글 목록을 갱신합니다.
 */
export async function deleteReply(state: ApiRes<PostReply> | null, formData: FormData): ApiResPromise<PostReply> {
  const accessToken = formData.get("accessToken");
  const replyId = formData.get("replyId");
  const postId = formData.get("_id") as string;

  let res: Response;
  let data: ApiRes<PostReply>;
  const body = Object.fromEntries(formData.entries());

  try {
    res = await fetch(`${API_URL}/posts/${postId}/replies/${replyId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Client-Id": CLIENT_ID,
        Authorization: `Bearer ${accessToken}`,
      },
    });
    data = await res.json();
  } catch (err) {
    console.error(err);
    return { ok: 0, message: "일시적인 네트워크 문제가 발생했습니다." };
  }
  if (data.ok) {
    revalidatePath(`/school/market/[marketType]/${body._id}`);
  }
  return data;
}

/**
 * 특정 게시글의 댓글 목록을 가져옵니다.
 * @param {number} _id - 게시글의 고유 ID
 * @returns {Promise<ApiRes<PostReply[]>>} - 댓글 목록 응답 객체
 */
export async function getReplies(_id: number): ApiResPromise<PostReply[]> {
  try {
    const res = await fetch(`${API_URL}/posts/${_id}/replies`, {
      headers: {
        "Client-Id": CLIENT_ID,
      },
      cache: "no-store", // 댓글은 실시간으로 업데이트되어야 하므로
    });
    return res.json();
  } catch (error) {
    // 네트워크 오류 처리
    console.error(error);
    return { ok: 0, message: "댓글을 불러오는데 실패했습니다." };
  }
}

/**
 * 키워드 검색하는 함수
 * @params keyword - 검색 키워드
 * @params type - 게시판 타입(buy | sell)
 * @return 검색 결과
 */

export async function searchPost(keyword: string, type: "buy" | "sell"): ApiResPromise<Post[]> {
  try {
    const urlParams = new URLSearchParams({
      type: type,
      keyword: keyword.trim(),
    });
    console.log("검색 URL:", `${API_URL}/posts?${urlParams.toString()}`); // 디버깅

    const res = await fetch(`${API_URL}/posts?${urlParams.toString()}`, {
      headers: {
        "Client-Id": CLIENT_ID,
      },
      cache: "no-store", // 검색은 실시간 데이터
    });
    console.log("응답상태: ", res.status);

    const data = await res.json();

    if (data.ok) {
      console.log(
        "검색된 게시글 제목들:",
        data.item.map((post: Post) => post.title)
      );
    }
    return data;
  } catch (err) {
    console.error(err);
    return { ok: 0, message: "검색 중 오류 발생" };
  }
}
