# Pagination Hooks

이 디렉토리에는 페이지네이션을 위한 2개의 훅이 있습니다.

## usePagination.ts

**기본 정적 페이지네이션**

- 고정된 아이템 수로 페이지네이션
- 간단함 (계산이랄게 없으니 당연.)
- 대부분의 일반적인 경우에 사용가능합니다

```tsx
const pagination = usePagination({
  data: items,
  itemsPerPage: 10,
});
```

## 📱 useResponsivePagination.ts

**반응형 동적 페이지네이션**

- 화면 크기에 따라 자동으로 아이템 수 조정
- 모바일/태블릿 대응(대부분의 핸드폰 기기에 적용 가능)
- Hydration 사용
- 하단 네비게이션을 고려한 사이즈 -> 페이지네이션을 이용하기 위해 스크롤 이동 필요 x 한 화면에 사용 가능

```tsx
const pagination = useResponsivePagination({
  data: items,
  estimatedItemHeight: 88,
  minItemsPerPage: 3,
  maxItemsPerPage: 10,
  reservedHeight: 250,
});
```

## 🤔 이런 상황일 때 사용을 권장드립니다

### usePagination 사용 권장:

- 정적 위주의 페이지
- 아이템 수가 고정되어도 상관없는 경우(나는 스크롤 내리고 올리는데 부담이 없다!)
- 단순한 목록 페이지(props로 전달을 적게 하고 싶다!)

### useResponsivePagination 사용 권장:

- 모바일 친화적인 페이지(se~xr 까지 제대로 동적으로 반응 확인 완료)
- 다양한 화면 크기 지원이 필요한 경우
- 하단 네비게이션이 있는 모바일 앱
- 최적의 사용자 경험이 중요한 경우(불필요한 스크롤 싫다!)
