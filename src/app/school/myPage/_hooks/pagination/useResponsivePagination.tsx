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

  const totalPages = Math.ceil(data.length / minItemsPerPage);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * minItemsPerPage;
    return data.slice(startIndex, startIndex + minItemsPerPage);
  }, [data, currentPage, minItemsPerPage]);

  const handlePageChange = (selectedItem: PageChangeEvent) => {
    setCurrentPage(selectedItem.selected + 1);
  };

  return {
    currentPage,
    totalPages,
    paginatedData,
    handlePageChange,
    setCurrentPage,
    hasData: data.length > 0,
  };
}
