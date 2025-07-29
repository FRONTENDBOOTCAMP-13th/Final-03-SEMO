/**
 * Pagination 컴포넌트
 *
 * React Paginate를 기반으로 한 페이지네이션 컴포넌트입니다.
 * useResponsivePagination 훅과 함께 사용하여 반응형 페이지네이션을 구현할 수 있습니다.
 *
 * @example
 * // useResponsivePagination과 함께 사용 할때
 * const pagination = useResponsivePagination({
 *   data: items,
 *   estimatedItemHeight: 88,
 *   minItemsPerPage: 3,
 *   maxItemsPerPage: 10,
 *   reservedHeight: 250,
 * });
 *
 * <Pagination
 *   pageCount={pagination.totalPages}
 *   onPageChange={pagination.handlePageChange}
 *   forcePage={pagination.currentPage - 1}
 * />
 *
 * @example
 * // 기본 사용법
 * const [currentPage, setCurrentPage] = useState(0);
 * const totalPages = Math.ceil(data.length / itemsPerPage);
 *
 * const handlePageChange = (selectedItem: { selected: number }) => {
 *   setCurrentPage(selectedItem.selected);
 * };
 *
 * <Pagination
 *   pageCount={totalPages}
 *   onPageChange={handlePageChange}
 *   forcePage={currentPage}
 * />
 *
 * @param pageCount - 총 페이지 수
 * @param onPageChange - 페이지 변경 시 호출되는 콜백 함수
 * @param forcePage - 강제로 선택할 페이지 번호 (0부터 시작, 옵셔널)
 */

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
