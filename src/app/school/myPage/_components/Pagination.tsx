"use client";

import ReactPaginate from "react-paginate";

interface PaginationProps {
  pageCount: number;
  onPageChange: (selectedItem: { selected: number }) => void;
  forcePage?: number;
}

export default function Pagination({ pageCount, onPageChange, forcePage = 0 }: PaginationProps) {
  return (
    <ReactPaginate
      pageCount={pageCount}
      pageRangeDisplayed={3}
      marginPagesDisplayed={1}
      onPageChange={onPageChange}
      // 페이지네이션 스타일 부분
      previousLabel="‹"
      nextLabel="›"
      breakLabel="..."
      containerClassName="flex space-x-2 justify-center mt-4"
      activeClassName="bg-uni-blue-400 text-white rounded px-3 py-1"
      pageClassName="px-3 py-1 text-gray-700 hover:bg-gray-200 rounded"
      previousClassName="px-2 py-1 text-gray-700 hover:bg-gray-200"
      nextClassName="px-2 py-1 text-gray-700 hover:bg-gray-200"
      disabledClassName="text-gray-300"
      forcePage={forcePage}
    />
  );
}
