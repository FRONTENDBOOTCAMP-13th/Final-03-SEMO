# 마이페이지 API 연동 구조 문서 (최종 정리된 버전)

## 📁 최종 파일 구조

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

## 🔧 주요 개선사항

### 1. 폴더 구조 최적화

- **기존 문제**: 루트 폴더(`src/services`, `src/hooks`)에 myPage 전용 파일들이 분산
- **해결책**: myPage 폴더 내부에 `_services`, `_hooks`, `_types` 폴더로 집중화
- **장점**: 다른 개발자들과 충돌 없이 독립적인 개발 가능

### 2. 이미지 처리 문제 해결

- **기존 문제**: 빈 문자열 이미지 src로 인한 브라우저 에러
- **해결책**:
  - 이미지 압축 및 Data URL 변환 기능 추가
  - 안전한 이미지 URL 처리 함수 구현
  - 기본 이미지 fallback 처리
  - `onError` 핸들러로 이미지 로드 실패 처리

### 3. API 서비스 개선

- **이미지 압축**: Canvas API를 이용한 클라이언트 사이드 압축
- **Data URL 변환**: base64 대신 효율적인 Data URL 처리
- **토큰 관리**: 로컬 스토리지 자동 복원
- **에러 처리**: 상세한 에러 메시지 제공

## 🚀 주요 기능

### 1. 이미지 압축 및 업로드 (`apiService.ts`)

```typescript
// 이미지 압축 (최대 800px, 품질 80%)
private static compressImage(file: File, maxWidth = 800, quality = 0.8): Promise<string>

// 안전한 이미지 URL 반환
static getSafeImageUrl(imagePath: string | null | undefined, defaultPath = '/assets/defaultimg.png'): string
```

### 2. 개선된 API 호출 흐름

1. **로그인** → 토큰 자동 저장
2. **사용자 정보 조회** → 이미지 URL 자동 처리
3. **이미지 업로드** → 압축 후 업로드
4. **프로필 업데이트** → 업데이트된 정보 자동 새로고침

## 🧪 테스트 방법

### API 테스트 컴포넌트 사용법

1. `http://localhost:3000/school/myPage` 접속
2. API 테스트 패널에서 순서대로 테스트:
   - **로그인**: `parksw003@soongsil.ac.kr` / `030101`
   - **사용자 정보 조회**: ID 3번 사용자 데이터 로드
   - **프로필 업데이트**: 닉네임, 은행 정보 수정
   - **이미지 업로드**: 압축된 이미지 업로드 및 프로필 반영

### 실제 사용 예시 (account 페이지)

```typescript
// 컴포넌트 마운트 시
useEffect(() => {
  const loadUserData = async () => {
    const user = await getUserProfile(3);
    if (user) {
      setUserData(user);
      // 이미지가 안전하게 처리됨
      setProfileImage(user.image);
    }
  };
  loadUserData();
}, []);

// 이미지 업로드 시 자동 압축
const handleImageUpload = async (file: File) => {
  const imageUrl = await uploadProfileImage(file); // 자동 압축됨
  if (imageUrl) {
    setProfileImage(imageUrl);
  }
};
```

## ✅ 해결된 문제들

1. **이미지 src 빈 문자열 에러** → 안전한 URL 처리로 해결
2. **복잡한 폴더 구조** → myPage 내부로 집중화
3. **이미지 업로드 실패** → Data URL 압축 방식으로 해결
4. **유지보수 어려움** → 단일 파일에서 모든 API 관리

## 🔍 다음 단계

- 실제 로그인 시스템과 연동
- 에러 바운더리 추가
- 이미지 로딩 상태 개선
- 오프라인 지원 고려
  accountNumber: "123456789",
  profileImage: "image-url",
  });

// 이미지 업로드
const imageUrl = await uploadProfileImage(file);

```

## 🎯 환경 변수

`.env` 파일에 다음 변수들이 설정되어 있어야 합니다:

```

## 📝 참고사항

- Bruno 테스트 파일들이 `api/dbinit/team_test/` 폴더에 있습니다
- 계좌번호는 문자열로 입력받지만 API에서는 숫자로 저장됩니다
- 이미지는 5MB 이하의 이미지 파일만 업로드 가능합니다
- 모든 API 호출은 에러 처리가 포함되어 있습니다

```

```
