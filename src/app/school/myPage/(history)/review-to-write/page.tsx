import type { Metadata } from 'next';
import ReviewToWriteClient from './ReviewToWriteClient';

// SEO를 위한 메타 데이터
export const metadata: Metadata = {
  title: '후기 작성하기',
  description: '거래가 완료된 상품에 대한 후기를 남겨주세요. 여러분의 소중한 후기가 더 좋은 거래 문화를 만듭니다.',
};

export default function ReviewToWritePage() {
  return (
    <main>
      <h1 className="sr-only">후기 작성하기</h1> {/* 스크린 리더 사용자를 위한 제목 */}
      <ReviewToWriteClient />
    </main>
  );
}