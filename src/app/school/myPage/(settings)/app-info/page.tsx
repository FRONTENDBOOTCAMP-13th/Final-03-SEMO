export default function AppInfoPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Content */}
      <div className="flex-1 bg-uni-white mt-2 px-4 py-6">
        <div className="space-y-8">
          {/* 앱 정보 섹션 */}
          <div>
            <h2 className="text-18 font-medium mb-4 text-uni-black font-pretendard">앱 정보</h2>

            <div className="space-y-6">
              <div>
                <div className="text-14 text-uni-gray-600 mb-1 font-pretendard">버전</div>
                <div className="text-14 text-uni-gray-500 font-pretendard">0.0.1</div>
              </div>

              <div>
                <div className="text-14 text-uni-gray-600 mb-1 font-pretendard">개발자</div>
                <div className="text-14 text-uni-gray-500 font-pretendard">(주)SE.MO</div>
              </div>

              <div>
                <div className="text-14 text-uni-gray-600 mb-1 font-pretendard">개인정보처리방침</div>
                <div className="text-14 text-uni-blue-600 font-pretendard">https://semo.com/privacy</div>
              </div>

              <div>
                <div className="text-14 text-uni-gray-600 mb-1 font-pretendard">이용 약관</div>
                <div className="text-14 text-uni-blue-600 font-pretendard">https://semo.com/terms</div>
              </div>

              <div>
                <div className="text-14 text-uni-gray-600 mb-1 font-pretendard">라이선스</div>
                <div className="text-14 text-uni-blue-600 font-pretendard">https://semo.com/licenses</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-uni-white px-4 py-6 border-t border-uni-gray-100">
        <div className="text-center text-12 text-uni-gray-400 font-pretendard">© 2025 SE.MO 주식회사</div>
      </div>
    </div>
  );
}
