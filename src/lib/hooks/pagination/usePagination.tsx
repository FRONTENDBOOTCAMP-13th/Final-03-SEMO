import { useState, useMemo } from "react";

interface UsePaginationProps<T> {
  data: T[];
  itemsPerPage: number;
  initialPage?: number;
}

interface PageChangeEvent {
  selected: number;
}

export function usePagination<T>({ data, itemsPerPage, initialPage = 1 }: UsePaginationProps<T>) {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  //현재 페이지에 보여줄 데이터 배열 잘라서 반환
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
  }, [data, currentPage, itemsPerPage]);

  //페이지 클릭 시 페이지 이동 실행
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
