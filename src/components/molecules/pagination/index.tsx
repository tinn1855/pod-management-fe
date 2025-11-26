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

export function AppPagination({ totalPages }: { totalPages: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page") ?? 1);

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

  return (
    <Pagination>
      <PaginationContent>
        {/* Prev */}
        <PaginationItem>
          <PaginationPrevious
            href={createQuery(Math.max(page - 1, 1))}
            aria-disabled={page === 1}
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
            aria-disabled={page === totalPages}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
