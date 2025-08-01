import OnboardingSlider from "@/components/OnboardingSlider";

export default function Home() {
  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-gradient-to-br from-uni-gray-100 via-uni-blue-100 to-uni-blue-200">
      {/* 배경 장식 요소들 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-uni-blue-400 to-uni-blue-600 rounded-full opacity-10 animate-liquid-float"></div>
        <div
          className="absolute -bottom-32 -left-32 w-64 h-64 bg-gradient-to-tr from-uni-blue-300 to-uni-blue-500 rounded-full opacity-15 animate-float"
          style={{ animationDelay: "3s" }}
        ></div>
        <div className="absolute top-20 left-10 w-16 h-16 bg-gradient-to-br from-uni-white to-uni-blue-200 rounded-full opacity-20 animate-pulse-slow"></div>
        <div
          className="absolute bottom-40 right-16 w-12 h-12 bg-gradient-to-br from-uni-blue-200 to-uni-blue-300 rounded-full opacity-25 animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/3 left-1/4 w-8 h-8 bg-gradient-to-br from-uni-blue-200 to-uni-blue-400 rounded-full opacity-30 animate-float"
          style={{ animationDelay: "2.5s" }}
        ></div>
        <div
          className="absolute bottom-1/3 right-1/3 w-6 h-6 bg-gradient-to-br from-uni-blue-300 to-uni-blue-500 rounded-full opacity-35 animate-pulse-slow"
          style={{ animationDelay: "1.8s" }}
        ></div>
      </div>

      {/* 온보딩 슬라이더 (상태 관리가 필요한 부분만 클라이언트 컴포넌트) */}
      <OnboardingSlider />
    </div>
  );
}
