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

  useEffect(() => {
    setIsClient(true);
    setViewportHeight(window.innerHeight);
  }, []);

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
