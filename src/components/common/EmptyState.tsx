/**
 * EmptyState 컴포넌트
 *
 * 빈 상태를 보여주는 컴포넌트입니다.
 *
 * @example
 * <EmptyState message="아직 거래한게 없어요" />
 *
 * @param message - 표시할 메시지 문자열
 */
"use client";

interface EmptyStateProps {
  message: string;
}

export default function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="text-center p-8 text-uni-gray-400 bg-uni-gray-100 rounded-xl border border-uni-gray-100">
      <p className="text-14 font-semibold font-pretendard">{message}</p>
    </div>
  );
}
