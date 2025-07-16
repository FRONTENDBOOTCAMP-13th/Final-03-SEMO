"use client";

import ReactPaginate from "react-paginate";

export default function Pagination({ pageCount, onPageChange, forcePage = 0 }) {
  return <ReactPaginate pageCount={pageCount} onPageChange={onPageChange} forcePage={forcePage} />;
}
