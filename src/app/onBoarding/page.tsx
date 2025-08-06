import OnboardingSliderForm from "@/app/onBoarding/OnboardingSliderForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "UniStuff | 온보딩 페이지",
  description: "UniStuff의 온보딩 페이지 입니다",
};

export default function OnBoardingPage() {
  return (
    <main className="flex justify-center items-center min-h-screen bg-white">
      <div className="min-w-[320px] w-full max-w-[480px] px-6 py-12 flex flex-col items-center">
        {/* 온보딩 슬라이더 */}
        <OnboardingSliderForm />
      </div>
    </main>
  );
}
