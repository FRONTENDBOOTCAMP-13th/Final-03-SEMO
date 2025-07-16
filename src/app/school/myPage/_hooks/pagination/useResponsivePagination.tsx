import { useState, useMemo, useEffect, useCallback } from "react";

interface UseResponsivePaginationProps<T> {
  data: T[];
  estimatedItemHeight?: number;
  minItemsPerPage?: number;
  maxItemsPerPage?: number;
  initialPage?: number;
  reservedHeight?: number;
}

interface PageChangeEvent {
  selected: number;
}

export function useResponsivePagination<T>({
  data,
  estimatedItemHeight = 100,
  minItemsPerPage = 3,
  maxItemsPerPage = 10,
  initialPage = 1,
  reservedHeight = 200,
}: UseResponsivePaginationProps<T>) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [viewportHeight, setViewportHeight] = useState(800);
  const [isClient, setIsClient] = useState(false);

  // 클라이언트 마운트 시 실제 높이 설정!
  useEffect(() => {
    setIsClient(true);
    setViewportHeight(window.innerHeight);
  }, []);

  /*브라우저 창 크기 바뀔 때마다 viewportHeight를 갱신하는 섹션 */
  // 뷰포트 리사이즈 감지
  const updateViewportHeight = useCallback(() => {
    setViewportHeight(window.innerHeight);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    window.addEventListener("resize", updateViewportHeight);
    return () => window.removeEventListener("resize", updateViewportHeight);
  }, [isClient, updateViewportHeight]);

  // 페이지당 아이템 개수 계산 (동적으로 구현)
  const itemsPerPage = useMemo(() => {
    if (!isClient) return minItemsPerPage;

    //헤더, 네비 같은 고정 영역 제외한 실제 공간 높이 계산
    const availableHeight = Math.max(viewportHeight - reservedHeight, 200);
    //높이로 나눠서 몇 개의 아이템이 들어갈 수 있는지 계산
    const calculatedItems = Math.floor(availableHeight / estimatedItemHeight);

    return Math.max(minItemsPerPage, Math.min(maxItemsPerPage, calculatedItems));
  }, [isClient, viewportHeight, estimatedItemHeight, minItemsPerPage, maxItemsPerPage, reservedHeight]);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  // 페이지 유효성 검사 (만약 현재 페이지가 totalPages보다 커지면 currentPage를 totalPages로 맞춥니다)
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
  }, [data, currentPage, itemsPerPage]);

  const handlePageChange = (selectedItem: PageChangeEvent) => {
    setCurrentPage(selectedItem.selected + 1);
  };

  const resetToFirstPage = () => setCurrentPage(1);

  return {
    currentPage,
    totalPages,
    itemsPerPage,
    paginatedData,
    handlePageChange,
    resetToFirstPage,
    setCurrentPage,
    hasData: data.length > 0,
    viewportHeight,
    isClient,
  };
}
