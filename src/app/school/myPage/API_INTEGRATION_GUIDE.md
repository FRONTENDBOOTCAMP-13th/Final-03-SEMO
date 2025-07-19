src/app/school/myPage/
├── \_services/
│ └── apiService.ts # 마이페이지 전용 API 서비스 (이미지 압축 포함)
├── \_hooks/
│ └── useMyPageApi.ts # 마이페이지 전용 API 훅
├── \_types/
│ └── user.ts # 마이페이지 전용 타입 정의
├── \_test/
│ └── ApiTestComponent.tsx # API 테스트용 컴포넌트
├── page.tsx # 메인 마이페이지 (테스트 컴포넌트 포함)
└── (settings)/account/
└── page.tsx # 계정 설정 페이지

## 🔗 API 연동 흐름

1. **페이지 로드** → 사용자 정보 조회 → 폼에 데이터 채우기
2. **이미지 업로드** → 파일 업로드 API 호출 → 이미지 URL 받기
3. **저장하기** → 유효성 검사 → 프로필 업데이트 API 호출
4. **로딩 상태** → 사용자에게 진행 상황 표시
