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

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
  }, [data, currentPage, itemsPerPage]);

  const handlePageChange = (selectedItem: PageChangeEvent) => {
    setCurrentPage(selectedItem.selected + 1);
  };

  return {
    currentPage,
    totalPages,
    paginatedData,
    handlePageChange,
    setCurrentPage,
  };
}
