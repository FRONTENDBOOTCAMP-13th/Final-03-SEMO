import SplashScreenForm from "@/components/SplashScreenForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "UniStuff",
  description: "UniStuff - 대학생을 위한 올인원 플랫폼",
};

export default function Home() {
  return (
    <main className="flex justify-center items-center min-h-screen bg-white">
      <div className="min-w-[320px] w-full max-w-[480px] px-6 py-12 flex flex-col items-center">
        <div className="flex flex-col items-center mb-12">
          <div className="flex items-center gap-1.5 mb-6">
            <img src="/assets/unistuffLogo.svg" alt="UNISTUFF Logo" className="w-12 h-12" />
            <h1 className="font-extrabold text-35 font-pretendard,sans-serif color-uni-black">UniStuff</h1>
          </div>
          <p className="text-uni-gray-600 text-sm text-center font-pretendard leading-relaxed">
            대학생을 위한 올인원 플랫폼
            <br />
            중고거래부터 커뮤니티까지 한번에
          </p>
        </div>

        {/* 클라이언트 컴포넌트로 분리 */}
        <div className="w-full max-w-sm">
          <SplashScreenForm />
        </div>

        <div className="mt-8 text-center text-uni-gray-500 text-xs">created by SEMO팀</div>
      </div>
    </main>
  );
}
