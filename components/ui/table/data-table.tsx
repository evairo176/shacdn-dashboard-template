"use client";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LIMIT_LIST } from "@/config/list.constant";
import useChangeUrl from "@/hooks/use-change-url";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel, // 🆕
  SortingState, // 🆕
  useReactTable,
} from "@tanstack/react-table";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../pagination";
import { useState } from "react";
// import { parseAsInteger, useQueryState } from 'nuqs';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  totalData: number;
  totalPages: number;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  totalData,
  totalPages,
}: DataTableProps<TData, TValue>) {
  const { currentPage, currentLimit, handleChangePage } = useChangeUrl();
  const [sorting, setSorting] = useState<SortingState>([]); // 🆕
  const page = Math.max(1, Number(currentPage));
  const limit = Math.max(1, Number(currentLimit));

  const paginationState = {
    pageIndex: page - 1,
    pageSize: limit,
  };

  const table = useReactTable({
    data,
    columns,
    pageCount: totalPages,
    state: {
      pagination: paginationState,
      sorting, // 🆕
    },
    onSortingChange: setSorting, // 🆕
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(), // 🆕
    manualPagination: true, // (tetap server-side paginate)
  });

  const range = getPaginationRange(page, totalPages, 1, 1);

  // helper buat range angka + ellipsis
  function getPaginationRange(
    current: number,
    total: number,
    siblingCount = 1,
    boundaryCount = 1
  ): Array<number | "…"> {
    const totalPageNumbers = boundaryCount * 2 + siblingCount * 2 + 3;
    if (total <= totalPageNumbers) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    const leftSibling = Math.max(current - siblingCount, boundaryCount + 2);
    const rightSibling = Math.min(
      current + siblingCount,
      total - boundaryCount - 1
    );
    const showLeftEllipsis = leftSibling > boundaryCount + 2;
    const showRightEllipsis = rightSibling < total - boundaryCount - 1;

    const pages: Array<number | "…"> = [];
    for (let i = 1; i <= boundaryCount; i++) pages.push(i);
    if (showLeftEllipsis) pages.push("…");
    else for (let i = boundaryCount + 1; i < leftSibling; i++) pages.push(i);
    for (let i = leftSibling; i <= rightSibling; i++) pages.push(i);
    if (showRightEllipsis) pages.push("…");
    else
      for (let i = rightSibling + 1; i <= total - boundaryCount; i++)
        pages.push(i);
    for (let i = total - boundaryCount + 1; i <= total; i++) pages.push(i);
    return pages;
  }

  return (
    <>
      <div className="overflow-hidden rounded-md border">
        <ScrollArea className="flex-1">
          <Table className="relative border border-border">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      <div className="flex flex-col items-center justify-end gap-2 space-x-2 py-2 sm:flex-row">
        <div className="flex w-full items-center justify-between">
          <div className="flex-1 text-sm text-muted-foreground">
            {totalData > 0 ? (
              <>
                Showing {table.getRowModel().rows.length} of {totalData} entries
              </>
            ) : (
              "No entries found"
            )}
          </div>
          {/* Pagination hanya tampil kalau data lebih banyak dari satu halaman */}

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8">
            <div className="flex items-center space-x-2">
              {/* <p className='whitespace-nowrap text-sm font-medium'>
                Rows per page
              </p> */}
              {table.getFilteredSelectedRowModel().rows.length > 0 && (
                <div className="flex-1 text-sm text-muted-foreground">
                  {table.getFilteredSelectedRowModel().rows.length} of{" "}
                  {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
              )}

              <Select
                value={`${paginationState.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value));
                }}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue placeholder={paginationState.pageSize} />
                </SelectTrigger>
                <SelectContent side="top">
                  {LIMIT_LIST.map((limit) => (
                    <SelectItem key={limit.value} value={`${limit.value}`}>
                      {limit.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        {totalData > limit && (
          <div className="block md:flex w-full items-center justify-center md:justify-between ">
            <div className="flex-1 text-sm text-muted-foreground text-nowrap">
              {totalData > 0 ? (
                <>
                  Page {paginationState.pageIndex + 1} of {table.getPageCount()}
                </>
              ) : (
                "No pages"
              )}
            </div>

            <Pagination className="justify-end">
              <PaginationContent>
                {/* Prev */}
                <PaginationItem>
                  <PaginationPrevious
                    size="sm"
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (page > 1) handleChangePage(page - 1);
                    }}
                    className={
                      page <= 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>

                {/* Angka + Ellipsis */}
                {range.map((it, idx) =>
                  it === "…" ? (
                    <PaginationItem key={`dots-${idx}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={it}>
                      <PaginationLink
                        size="sm"
                        href="#"
                        isActive={it === page}
                        onClick={(e) => {
                          e.preventDefault();
                          if (it !== page) handleChangePage(it);
                        }}
                      >
                        {it}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}

                {/* Next */}
                <PaginationItem>
                  <PaginationNext
                    size="sm"
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (page < totalPages) handleChangePage(page + 1);
                    }}
                    className={
                      page >= totalPages ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </>
  );
}
