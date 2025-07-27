// API 응답 형식 정의

// 데이터 검증 실패시 개별 에러 메시지
export interface ServerValidationError {
  type: string;
  value: string;
  msg: string;
  location: string;
}

export type ServerValidationErrors<E> = Partial<Record<keyof E, ServerValidationError>>;

// API 서버의 응답
// E = never: E가 생략되면 errors 속성도 없음

// 서버 응답이 성공인지 실패인지 구분해서 타입을 나눈 것
export type ApiRes<T, E = never> = { ok: 1; item: T } | { ok: 0; message: string; errors?: ServerValidationErrors<E> };

// 서버 함수에서 반환할 타입(Promise를 반환해야 함)
export type ApiResPromise<T> = Promise<ApiRes<T>>;
