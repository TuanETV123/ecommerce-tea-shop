import React, { useState } from "react";

const Pagination = ({ totalPages = 12, onPageChange }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageClick = (page) => {
    setCurrentPage(page);
    if (onPageChange) onPageChange(page);
  };

  const allPages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const visiblePages = allPages.filter((page) => {
    if (totalPages <= 7) return true;
    return (
      page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1
    );
  });

  return (
    <div className="mt-16 flex justify-center items-center gap-2">
      <button
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-12 h-12 flex items-center justify-center rounded-xl border-2 border-gray-100 text-gray-400 disabled:opacity-30 bg-white"
      >
        <span className="material-symbols-outlined">chevron_left</span>
      </button>

      {allPages.map((page) => {
        if (page <= 3 || page === totalPages || page === currentPage) {
          return (
            <button
              key={page}
              onClick={() => handlePageClick(page)}
              className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all font-bold ${
                currentPage === page
                  ? "bg-[#0d1b10] text-white font-black shadow-md"
                  : "border-2 border-gray-100 text-gray-500 hover:border-primary bg-white"
              }`}
            >
              {page}
            </button>
          );
        }

        if (page === 4 && totalPages > 5) {
          return (
            <span key="dots" className="px-2 text-gray-400 font-bold">
              ...
            </span>
          );
        }

        return null;
      })}

      <button
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-12 h-12 flex items-center justify-center rounded-xl border-2 border-gray-100 text-gray-400 disabled:opacity-30 bg-white"
      >
        <span className="material-symbols-outlined">chevron_right</span>
      </button>
    </div>
  );
};

export default Pagination;
