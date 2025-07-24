import { type ApiResPromise, type FileUpload } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID!;

/**
 * 파일 업로드 함수
 * @param formData - 업로드할 파일이 담긴 FormData 객체
 * @returns 파일 업로드 결과를 반환하는 Promise
 * @description
 * 파일을 서버에 업로드하고, 업로드된 파일 정보를 반환합니다.
 */

export async function uploadFile(formData: FormData): ApiResPromise<FileUpload[]> {
  // FormData 받아서 파일 업로드 결과 반환
  const fileForm = new FormData();
  // 새로운 FormData 객체를 생성하여 서버로 보낼 폼 데이터 준비함
  fileForm.append("attach", formData.get("attach") as File);
  // 받은 FormData에서 'attach' 파일 꺼내서 새로운 FormData에 추가한다.

  const res = await fetch(`${API_URL}/files`, {
    method: "POST",
    headers: {
      "Client-Id": CLIENT_ID,
    },
    body: fileForm,
  });
  return res.json();
}

/*
 * 이미지 URL을 반환하는 함수
 * @param imagePath - 이미지 파일 경로
 */
export function getImageUrl(imagePath: string | undefined): string {
  if (!imagePath || typeof imagePath !== "string") {
    return "/assets/defaultimg.png";
  }
  if (imagePath?.startsWith("files/")) {
    return `${API_URL}/${imagePath}`;
  }
  if (!imagePath.startsWith("http") && !imagePath.startsWith("/")) {
    return `/${imagePath}`;
  }
  return imagePath;
}
