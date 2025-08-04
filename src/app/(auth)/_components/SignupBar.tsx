"use client";

import { motion } from "framer-motion";

interface SignupBarProps {
  currentStep: number;
  totalSteps: number;
}

export default function SignupBar({ currentStep, totalSteps }: SignupBarProps) {
  const clampedStep = Math.min(Math.max(currentStep, 1), totalSteps);
  const percent = totalSteps > 1 ? ((clampedStep - 1) / (totalSteps - 1)) * 100 : 100;

  return (
    <div aria-label={`회원가입 진행도: ${clampedStep} / ${totalSteps}`} className="w-full max-w-lg mx-auto ">
      <div className="relative h-2 bg-gray-200 overflow-hidden ">
        <motion.div
          className="absolute left-0 top-0 h-full bg-uni-blue-400"
          initial={false}
          animate={{ width: `${percent}%` }}
          transition={{ type: "tween", ease: "easeOut", duration: 0.6 }}
        />
      </div>
    </div>
  );
}
