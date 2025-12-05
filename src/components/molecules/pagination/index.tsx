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
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";

interface AppPaginationProps {
  totalPages: number;
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
  const router = useRouter();

  // Use controlled page if provided, otherwise use URL params
  const isControlled =
    controlledPage !== undefined && onPageChange !== undefined;
  const page = isControlled
    ? controlledPage
    : Number(searchParams.get("page") ?? 1);

  const createQuery = useCallback(
    (value: number) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === 1) {
        params.delete("page");
      } else {
        params.set("page", value.toString());
      }
      const query = params.toString();
      return query ? `${pathname}?${query}` : pathname;
    },
    [searchParams, pathname]
  );

  const handlePageClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, newPage: number) => {
      e.preventDefault();
      if (isControlled) {
        onPageChange(newPage);
      } else {
        router.push(createQuery(newPage), { scroll: false });
      }
    },
    [isControlled, onPageChange, router, createQuery]
  );

  const pages = useMemo(() => {
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
  }, [page, totalPages]);

  if (totalPages <= 1) return null;

  return (
    <Pagination>
      <PaginationContent>
        {/* Prev */}
        <PaginationItem>
          <PaginationPrevious
            href={createQuery(Math.max(page - 1, 1))}
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
                href={createQuery(Number(p))}
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
            href={createQuery(Math.min(page + 1, totalPages))}
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
