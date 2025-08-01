"use client";
import { useState, useEffect } from "react";

interface CountdownProps {
  deadLine: string;
}

export default function Countdown({ deadLine }: CountdownProps) {
  const [time, setTime] = useState({
    days: 0,
    hours: 0,
    min: 0,
    sec: 0,
    Expired: false,
  });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const deadLineTime = new Date(deadLine).getTime();
      const difference = deadLineTime - now;

      if (difference <= 0) {
        setTime({
          days: 0,
          hours: 0,
          min: 0,
          sec: 0,
          Expired: true,
        });
        return;
      }
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const min = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const sec = Math.floor((difference % (1000 * 60)) / 1000);

      setTime({ days, hours, min, sec, Expired: false });
    };

    calculateTime();

    const timer = setInterval(calculateTime, 1000);

    return () => clearInterval(timer);
  }, [deadLine]);

  if (time.Expired) {
    return <div className="text-uni-blue-400 text-14 font-bold mt-3">마감되었습니다</div>;
  }
  return (
    <div className="flex pt-2 gap-1 text-14 font-medium">
      {time.days > 0 && <span className="text-uni-blue-400 font-bold py-1">{time.days}일</span>}
      <span className="text-uni-blue-400 font-bold py-1">{time.hours.toString().padStart(2, "0")}시간</span>
      <span className="text-uni-blue-400 font-bold py-1">{time.min.toString().padStart(2, "0")}분</span>
      <span className="text-uni-blue-400 font-bold py-1">{time.sec.toString().padStart(2, "0")}초</span>
    </div>
  );
}
