import React from 'react';
import {
  Pagination as ShadcnPagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination"

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const effectiveTotalPages = Math.max(1, totalPages);

  const getPageNumbers = () => {
    const pages = [];
    const showMax = 5;

    let start = Math.max(0, currentPage - 2);
    let end = Math.min(effectiveTotalPages - 1, start + showMax - 1);

    if (end - start + 1 < showMax) {
      start = Math.max(0, end - showMax + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="w-full">
      <ShadcnPagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                if (currentPage > 0) onPageChange(currentPage - 1);
              }}
              className={currentPage === 0 ? "pointer-events-none opacity-50 bg-transparent text-gray-500 hover:bg-transparent" : "bg-white border-gray-200 text-gray-700 hover:bg-gray-100"}
            />
          </PaginationItem>
          
          {getPageNumbers().map((page) => (
            <PaginationItem key={page}>
              <PaginationLink 
                href="#" 
                isActive={currentPage === page}
                onClick={(e) => {
                   e.preventDefault();
                   onPageChange(page);
                }}
                className={currentPage === page ? "bg-gray-900 border-gray-900 text-white hover:bg-gray-800 hover:text-white" : "border-gray-200 text-gray-700 hover:bg-gray-100"}
              >
                {page + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                if (currentPage < effectiveTotalPages - 1) onPageChange(currentPage + 1);
              }}
              className={currentPage === effectiveTotalPages - 1 ? "pointer-events-none opacity-50 bg-transparent text-gray-500 hover:bg-transparent" : "bg-white border-gray-200 text-gray-700 hover:bg-gray-100"}
            />
          </PaginationItem>
        </PaginationContent>
      </ShadcnPagination>
    </div>
  );
};

export default Pagination;
