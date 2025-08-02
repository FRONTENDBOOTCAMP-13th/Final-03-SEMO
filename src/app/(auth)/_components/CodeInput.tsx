import { useEffect, useRef, useState } from "react";

interface VerificationCodeInputProps {
  length?: number; // 기본 4
  value?: string; // 외부에서 제어할 경우
  onChange?: (code: string) => void;
  disabled?: boolean;
  autoFocus?: boolean;
  className?: string;
}

export default function VerificationCodeInput({
  length = 4,
  value,
  onChange,
  disabled = false,
  autoFocus = true,
  className = "",
}: VerificationCodeInputProps) {
  const [digits, setDigits] = useState<string[]>(Array(length).fill(""));
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  // 외부 value로 동기화
  useEffect(() => {
    if (typeof value === "string") {
      const v = value.slice(0, length).padEnd(length, "").split("");
      setDigits(v);
    }
  }, [value, length]);

  // 내부 변경 통지
  useEffect(() => {
    onChange?.(digits.join(""));
  }, [digits, onChange]);

  const focusInput = (idx: number) => {
    inputsRef.current[idx]?.focus();
    inputsRef.current[idx]?.select();
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const raw = e.target.value;
    const num = raw.replace(/\D/g, "").slice(-1); // 숫자 하나만
    setDigits((prev) => {
      const next = [...prev];
      next[idx] = num;
      return next;
    });

    if (num && idx < length - 1) {
      focusInput(idx + 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      setDigits((prev) => {
        const next = [...prev];
        if (next[idx]) {
          next[idx] = "";
        } else if (idx > 0) {
          next[idx - 1] = "";
          focusInput(idx - 1);
        }
        return next;
      });
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      if (idx > 0) focusInput(idx - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      if (idx < length - 1) focusInput(idx + 1);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!pasted) return;
    const arr = pasted.split("");
    setDigits(() => {
      const next = Array(length).fill("");
      for (let i = 0; i < arr.length; i++) {
        next[i] = arr[i];
      }
      return next;
    });
    const nextFocus = Math.min(arr.length, length - 1);
    focusInput(nextFocus);
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      {digits.map((digit, i) => (
        <input
          key={i}
          type="text"
          inputMode="numeric"
          pattern="\d*"
          maxLength={1}
          aria-label={`인증번호 자리 ${i + 1}`}
          className="w-12 h-14 text-center rounded-lg border border-gray-300 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={digit}
          disabled={disabled}
          ref={(el) => {
            inputsRef.current[i] = el;
          }}
          onChange={(e) => handleInput(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          onPaste={handlePaste}
          onFocus={(e) => e.currentTarget.select()}
          autoFocus={autoFocus && i === 0}
        />
      ))}
    </div>
  );
}
