'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '../_components/Input';
import Button from '../_components/Button';
import BackButton from '../_components/BackButton';

export default function SignupEmailPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  const handleEmailSubmit = () => {
    if (!email.includes('@')) {
      alert('올바른 이메일 형식이 아닙니다.');
      return;
    }

    // TODO: 백엔드 요청 후 페이지 이동
    router.push('/signup/code');
  };

  return (
    <main className="bg-white min-h-screen flex justify-center">
      <div className="min-w-[320px] w-full max-w-[480px] px-6 flex flex-col items-center justify-center flex-grow">
        {/* BackButton 정적 상단 배치 */}
        <div className="w-full mb-4">
          <BackButton />
        </div>
        {/* 환영 문구 */}
        <div className="text-left w-full max-w-sm mb-10">
          <p className="font-semibold" style={{ color: 'var(--color-uni-black)', fontSize: 'var(--text-20)' }}>
            <span style={{ color: 'var(--color-uni-blue-400)', fontSize: 'var(--text-35)' }}>UniStuff</span>{' '}
            에 오신걸
          </p>
          <p style={{ color: 'var(--color-uni-black)', fontSize: 'var(--text-35)' }}className="font-bold">환영합니다!</p>
        </div>

        {/* 입력 영역 */}
        <div className="w-full max-w-sm space-y-16">
          <Input
            type="email"
            placeholder="학교 이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button type="primary" onClick={handleEmailSubmit}>
            이메일 인증
          </Button>
        </div>
      </div>
    </main>

  );
}
