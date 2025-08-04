import SplashScreenForm from "@/components/SplashScreenForm";

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

      {/* 스플래시 스크린 */}
      <div className="splash-screen relative z-10 flex flex-col items-center justify-center min-h-screen px-8 text-center max-w-sm mx-auto py-20">
        <div className="app-logo relative w-20 h-20 rounded-xl liquid-glass flex justify-center items-center mb-5 shadow-2xl animate-fade-in transition-all duration-[400ms] ease-[cubic-bezier(0.175,0.885,0.32,2.2)]">
          <div className="absolute inset-0 bg-gradient-to-br from-uni-blue-400 to-uni-blue-600 rounded-xl opacity-90"></div>
          <img
            src="/assets/unistuffLogo.svg"
            alt="UNISTUFF Logo"
            className="relative z-10 w-12 h-12 filter brightness-0 invert"
          />
        </div>

        <h1 className="text-2xl font-bold text-uni-blue-400 mb-3 animate-fade-in-delay-1">UNISTUFF</h1>
        <p className="text-uni-gray-600 text-sm mb-12 leading-relaxed animate-fade-in-delay-2">
          대학생을 위한 올인원 플랫폼
          <br />
          중고거래부터 커뮤니티까지 한번에
        </p>

        {/* 클라이언트 컴포넌트로 분리 */}
        <SplashScreenForm />

        <div className="absolute bottom-6 w-full text-center text-uni-gray-500 text-xs animate-fade-in-delay-4">
          created by SEMO팀
        </div>
      </div>
    </div>
  );
}
