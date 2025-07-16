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

## 🤔 이런 상황일 때 사용을 권장드립니다

### usePagination 사용 권장:

- 정적 위주의 페이지
- 아이템 수가 고정되어도 상관없는 경우(나는 스크롤 내리고 올리는데 부담이 없다!)
- 단순한 목록 페이지(props로 전달을 적게 하고 싶다!)
