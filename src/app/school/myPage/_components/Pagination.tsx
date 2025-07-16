"use client";

import ReactPaginate from "react-paginate";

interface PaginationProps {
  pageCount: number;
  onPageChange: (selectedItem: { selected: number }) => void;
  forcePage?: number;
}

export default function Pagination({ pageCount, onPageChange, forcePage = 0 }: PaginationProps) {
  return (
    <div className="mt-4">
      <ReactPaginate
        pageCount={pageCount}
        pageRangeDisplayed={3}
        marginPagesDisplayed={1}
        onPageChange={onPageChange}
        // 페이지네이션 스타일 부분
        previousLabel="‹"
        nextLabel="›"
        breakLabel="..."
        containerClassName="flex space-x-2 justify-center font-pretendard"
        activeClassName="bg-uni-blue-400 text-uni-white rounded px-3 py-1"
        pageClassName="px-3 py-1 text-uni-gray-400 hover:bg-uni-gray-100 rounded"
        previousClassName="px-2 py-1 text-uni-gray-400 hover:bg-uni-gray-100"
        nextClassName="px-2 py-1 text-uni-gray-400 hover:bg-uni-gray-100"
        disabledClassName="text-uni-gray-300"
        forcePage={forcePage}
      />
    </div>
  );
}
