"use client";

interface SignupBarProps {
  currentStep: number;
  totalSteps: number;
}

export default function SignupBar({ currentStep, totalSteps }: SignupBarProps) {
  const clampedStep = Math.min(Math.max(currentStep, 1), totalSteps);
  const percent = totalSteps > 1 ? ((clampedStep - 1) / (totalSteps - 1)) * 100 : 100;

  return (
    <div aria-label={`회원가입 진행도: ${clampedStep} / ${totalSteps}`} className="w-full max-w-lg mx-auto">
      <div className="relative h-2 bg-gray-200  overflow-hidden">
        <div className="absolute inset-0 h-full bg-uni-blue-400 transition-all" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
