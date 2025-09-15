"use client";

import { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import { ChevronFirst, ChevronLast } from "lucide-react";

interface PaginationControlsProps {
  page: number;
  totalPages: number;
  handleSearch: (newPage: number) => void;
  maxVisible?: number;
}

// 🔥 Overlay แสดงตอนกำลังโหลด
function LoadingOverlay({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-12 h-12 border-4 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

export function PaginationControls({
  page,
  totalPages,
  handleSearch,
  maxVisible = 10,
}: PaginationControlsProps) {
  const [showLoading, setShowLoading] = useState(false);

  if (totalPages <= 1) return null;

  // คำนวณช่วงตัวเลข pagination
  let start = Math.max(0, page - Math.floor(maxVisible / 2));
  const end = Math.min(totalPages - 1, start + maxVisible - 1);
  if (end - start + 1 < maxVisible) {
    start = Math.max(0, end - maxVisible + 1);
  }
  const pages = [];
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  // helper: แสดง overlay ตอนเปลี่ยนหน้า
  const goToPage = async (newPage: number) => {
    setShowLoading(true);
    try {
      await handleSearch(newPage);
    } finally {
      setShowLoading(false);
    }
  };

  // 🎨 class พื้นฐานของปุ่ม
  const baseBtn =
    "px-3 py-1.5 rounded-md bg-gray-800 text-gray-200 " +
    "hover:bg-gray-600 hover:text-white hover:shadow-md hover:scale-105 " +
    "transition-all duration-200 disabled:opacity-40 flex items-center gap-1 cursor-pointer";

  return (
    <>
      <Pagination>
        <PaginationContent className="flex flex-wrap gap-1 justify-center">
          {/* First */}
          <PaginationItem>
            <button
              onClick={() => goToPage(0)}
              disabled={page === 0}
              className={baseBtn}
            >
              <ChevronFirst className="w-4 h-4" />
              <span className="hidden sm:inline">First</span>
            </button>
          </PaginationItem>

          {/* Previous */}
          <PaginationItem>
            <PaginationPrevious
              onClick={() => page > 0 && goToPage(page - 1)}
              className={`${baseBtn}`}
            />
          </PaginationItem>

          {/* Numbers */}
          {pages.map((p) => (
            <PaginationItem key={p} className="hidden sm:inline">
              <PaginationLink
                onClick={() => goToPage(p)}
                isActive={p === page}
                className={`${baseBtn} ${
                  p === page ? "bg-gray-700 text-white shadow-md scale-105" : ""
                }`}
              >
                {p + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

          {/* Next */}
          <PaginationItem>
            <PaginationNext
              onClick={() => page < totalPages - 1 && goToPage(page + 1)}
              className={`${baseBtn}`}
            />
          </PaginationItem>

          {/* Last */}
          <PaginationItem>
  <button
    onClick={() => goToPage(totalPages - 1)}
    disabled={page === totalPages - 1}
    className={baseBtn}
  >
    <span className="hidden sm:inline">Last</span>
    <ChevronLast className="w-4 h-4" />
  </button>
</PaginationItem>
        </PaginationContent>
      </Pagination>

      {/* ✅ Overlay */}
      <LoadingOverlay show={showLoading} />
    </>
  );
}
