"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { usePathname, useSearchParams } from "next/navigation";

interface AppPaginationProps {
  totalPages: number;
  // Optional: for controlled mode (state-based)
  currentPage?: number;
  onPageChange?: (page: number) => void;
}

export function AppPagination({
  totalPages,
  currentPage: controlledPage,
  onPageChange,
}: AppPaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Use controlled page if provided, otherwise use URL params
  const isControlled =
    controlledPage !== undefined && onPageChange !== undefined;
  const page = isControlled
    ? controlledPage
    : Number(searchParams.get("page") ?? 1);

  const createQuery = (value: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 1) {
      params.delete("page");
    } else {
      params.set("page", value.toString());
    }
    const query = params.toString();
    return query ? `${pathname}?${query}` : pathname;
  };

  const handlePageClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    newPage: number
  ) => {
    if (isControlled) {
      e.preventDefault();
      onPageChange(newPage);
    }
  };

  const generatePages = () => {
    const pages: (number | "...")[] = [];

    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    pages.push(1, 2);

    if (page > 4) pages.push("...");

    const start = Math.max(3, page - 1);
    const end = Math.min(totalPages - 2, page + 1);

    for (let i = start; i <= end; i++) pages.push(i);

    if (page < totalPages - 3) pages.push("...");

    pages.push(totalPages - 1, totalPages);

    return pages;
  };

  const pages = generatePages();

  if (totalPages <= 1) return null;

  return (
    <Pagination>
      <PaginationContent>
        {/* Prev */}
        <PaginationItem>
          <PaginationPrevious
            href={isControlled ? "#" : createQuery(Math.max(page - 1, 1))}
            onClick={(e) => handlePageClick(e, Math.max(page - 1, 1))}
            aria-disabled={page === 1}
            className={page === 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>

        {/* Numbers */}
        {pages.map((p, i) =>
          p === "..." ? (
            <PaginationItem key={i}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={i}>
              <PaginationLink
                href={isControlled ? "#" : createQuery(Number(p))}
                onClick={(e) => handlePageClick(e, Number(p))}
                isActive={p === page}
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        {/* Next */}
        <PaginationItem>
          <PaginationNext
            href={
              isControlled ? "#" : createQuery(Math.min(page + 1, totalPages))
            }
            onClick={(e) => handlePageClick(e, Math.min(page + 1, totalPages))}
            aria-disabled={page === totalPages}
            className={
              page === totalPages ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
