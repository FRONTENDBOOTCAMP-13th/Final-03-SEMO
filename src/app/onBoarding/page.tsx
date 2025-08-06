import OnboardingSliderForm from "@/app/onBoarding/OnboardingSliderForm";

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
