import { useState } from "react";

interface UsePaginationProps<T> {
  data: T[];
  itemsPerPage: number;
  initialPage?: number;
}

export function usePagination<T>({ data, itemsPerPage, initialPage = 1 }: UsePaginationProps<T>) {
  const [currentPage, setCurrentPage] = useState(initialPage);

  return {
    currentPage,
    setCurrentPage,
  };
}
