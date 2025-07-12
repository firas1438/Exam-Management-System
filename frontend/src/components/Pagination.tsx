"use client";

import { useRouter } from "next/navigation";

interface PaginationProps {
  currentPage: number;
  count: number;
}

const Pagination = ({ currentPage,count }: PaginationProps) => {

  const ITEM_PER_PAGE=10
  const hasPrev = ITEM_PER_PAGE * (currentPage - 1) > 0;
  const hasNext = ITEM_PER_PAGE * (currentPage - 1) + ITEM_PER_PAGE < count;
  const router=useRouter()
  const changePage = (newPage: number) => {
    const params = new URLSearchParams(window.location.search);
    // new URLSearchParams(window.location.search) : retourner tout url 
    params.set("page", newPage.toString());
    router.push(`${window.location.pathname}?${params}`);
  };
  return (
    <div className="p-4 flex items-center justify-between text-gray-500">
      <button
      disabled={!hasPrev}
      className="py-2 px-4 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      onClick={() => {
        changePage(currentPage - 1);
 }}>
        Prev
      </button>
      <div className="flex items-center gap-2 text-sm">

        {Array.from(
          { length: Math.ceil(count / ITEM_PER_PAGE) },
          (_, index) => {
            const pageIndex = index + 1;
            return (
              <button
                key={pageIndex}
                className={`px-2 rounded-sm ${
                  currentPage === pageIndex ? "bg-lamaSky" : ""
                }`}
                onClick={() => {
                  changePage(pageIndex);
                }}
              >
                {pageIndex}
              </button>
            );
          }
        )}
      </div>
      <button
        disabled={!hasNext}
        onClick={() => {
          changePage(currentPage + 1);
        }}
        className="py-2 px-4 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;