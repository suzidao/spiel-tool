/** @format */

"use client";

import {
  Column,
  ColumnDef,
  ColumnFiltersState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  Row,
  RowData,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    classes?: string;
    filterVariant?: "text" | "range" | "number";
  }
}

export default function DataTable(props: { games: Entry[] }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const data = props.games;

  const columnHelper = createColumnHelper<Entry>();

  const columns = [
    columnHelper.accessor("geekitem.item.primaryname.name", {
      id: "GameTitle",
      cell: ({ cell, row }) => {
        const game = row.original.geekitem.item;
        return (
          <Link key={game.primaryname.nameid} href={`https://boardgamegeek.com${game.href}`} target="_blank">
            {game.primaryname.name}
          </Link>
        );
      },
      header: () => <span>Game Title</span>,
      sortingFn: "text",
    }),
    columnHelper.accessor<(row: Entry) => string, string>((row) => row.publishers[0].item.primaryname.name, {
      id: "Publisher",
      cell: ({ cell, row }) => {
        const publisher = row.original.publishers[0];
        return (
          <Link key={publisher.item.objectid} href={`https://boardgamegeek.com${publisher.item.href}`} target="_blank">
            {publisher.item.primaryname.name}
          </Link>
        );
      },
      header: () => <span>Publisher</span>,
      sortingFn: "text",
    }),
    columnHelper.accessor("geekitem.item.links.boardgamedesigner", {
      id: "Designers",
      cell: (info) => {
        const designers = info.getValue();
        if (designers.length > 0) {
          return designers.map((designer, idx) => {
            const isLast = designers.length - 1 === idx;
            const designerLink = (
              <Fragment key={designer.objectid}>
                <Link href={designer.canonical_link} target="_blank">
                  {designer.name}
                </Link>
                {!isLast && ", "}
              </Fragment>
            );
            return designerLink;
          });
        } else {
          return "–";
        }
      },
      header: () => <span>Designers</span>,
      enableSorting: false,
      filterFn: (row: Row<Entry>, _columnId: string, filterValue: string) => {
        const designers = row.original.geekitem.item.links.boardgamedesigner;
        return designers
          .map((designer: Designer) => {
            return designer.name
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .toLowerCase()
              .includes(filterValue);
          })
          .includes(true);
      },
    }),
    columnHelper.accessor("location", {
      id: "Location",
      cell: (info) => info.getValue(),
      header: () => <span>Location</span>,
      sortingFn: "text",
    }),
    columnHelper.accessor("reactions.thumbs", {
      id: "Thumbs",
      cell: (info) => {
        const thumbs = Number(info.getValue());
        return thumbs > 0 ? thumbs : "–";
      },
      header: () => <span>👍</span>,
      meta: {
        classes: "text-center min-w-12",
      },
      enableColumnFilter: false,
    }),
    columnHelper.accessor("version.item.releasedate", {
      id: "ReleaseDate",
      cell: (info) => info.getValue(),
      header: () => <span>Release Date</span>,
      meta: {
        classes: "whitespace-nowrap",
      },
      enableColumnFilter: false,
    }),

    columnHelper.accessor("geekitem.item.minplayers", {
      id: "MinPlayers",
      cell: (info) => {
        const minplayers = Number(info.getValue());
        return minplayers > 0 ? minplayers : "–";
      },
      header: () => <span>Min Players</span>,
      sortDescFirst: true,
      meta: {
        classes: "text-center",
        filterVariant: "number",
      },
    }),
    columnHelper.accessor("geekitem.item.maxplayers", {
      id: "MaxPlayers",
      cell: (info) => {
        const maxplayers = Number(info.getValue());
        return maxplayers > 0 ? maxplayers : "–";
      },
      header: () => <span>Max Players</span>,
      sortDescFirst: true,
      filterFn: "equalsString",
      meta: {
        classes: "text-center",
        filterVariant: "number",
      },
    }),
    columnHelper.accessor("geekitem.item.minplaytime", {
      id: "MinPlaytime",
      cell: (info) => {
        const minplaytime = Number(info.getValue());
        return minplaytime > 0 ? minplaytime : "–";
      },
      header: () => <span>Min Playtime</span>,
      sortDescFirst: true,
      filterFn: "equalsString",
      meta: {
        classes: "text-center",
        filterVariant: "number",
      },
    }),
    columnHelper.accessor("geekitem.item.maxplaytime", {
      id: "MaxPlaytime",
      cell: (info) => {
        const maxplaytime = Number(info.getValue());
        return maxplaytime > 0 ? maxplaytime : "–";
      },
      header: () => <span>Max Playtime</span>,
      sortDescFirst: true,
      filterFn: "equalsString",
      meta: {
        classes: "text-center",
        filterVariant: "number",
      },
    }),
    columnHelper.accessor<(row: Entry) => string, string>((row) => row.geekitem.item.dynamicinfo.item.stats.avgweight, {
      id: "Complexity",
      cell: (info) => {
        const avgweight = Number(info.getValue());
        return avgweight > 0 ? avgweight.toFixed(2) : "–";
      },
      header: () => <span>Complexity</span>,
      sortingFn: "basic",
      sortDescFirst: true,
      filterFn: "inNumberRange",
      meta: {
        classes: "text-center",
        filterVariant: "range",
      },
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    filterFns: {},
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(), //client side filtering
    getSortedRowModel: getSortedRowModel(), //client-side sorting
    onSortingChange: setSorting,
    state: { columnFilters, sorting },
    enableSortingRemoval: false,
  });

  return (
    <>
      <div>
        Total Games: {table.getFilteredRowModel().rows.length} | {table.getCoreRowModel().rows.length}
      </div>
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder ? null : (
                    <>
                      <div
                        className={
                          "text-left " +
                          (header.column.getCanSort() ? "cursor-pointer select-none " : "") +
                          header.column.columnDef.meta?.classes
                        }
                        onClick={header.column.getToggleSortingHandler()}
                        title={
                          header.column.getCanSort()
                            ? header.column.getNextSortingOrder() === "asc"
                              ? "Sort ascending"
                              : header.column.getNextSortingOrder() === "desc"
                              ? "Sort descending"
                              : "Clear sort"
                            : undefined
                        }
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{
                          asc: " 🔼",
                          desc: " 🔽",
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                      {header.column.getCanFilter() ? (
                        <div className={"text=left " + header.column.columnDef.meta?.classes}>
                          <Filter column={header.column} />
                        </div>
                      ) : null}
                    </>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => {
                return (
                  <td
                    key={cell.id}
                    className={"border-b border-gray-400 leading-5 px-1 py-2 " + cell.column.columnDef.meta?.classes}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

function Filter({ column }: { column: Column<any, unknown> }) {
  const columnFilterValue = column.getFilterValue();
  const { filterVariant } = column.columnDef.meta ?? {};

  return filterVariant === "range" ? (
    <div>
      <div className="flex space-x-2">
        {/* See faceted column filters example for min max values functionality */}
        <DebouncedInput
          type="number"
          value={(columnFilterValue as [number, number])?.[0] ?? ""}
          onChange={(value) => column.setFilterValue((old: [number, number]) => [value, old?.[1]])}
          min={1}
          max={5}
          placeholder={`Min`}
          className="border p-1 w-12"
        />
        <DebouncedInput
          type="number"
          value={(columnFilterValue as [number, number])?.[1] ?? ""}
          onChange={(value) => column.setFilterValue((old: [number, number]) => [old?.[0], value])}
          min={1}
          max={5}
          placeholder={`Max`}
          className="border p-1 w-12"
        />
      </div>
      <div className="h-1" />
    </div>
  ) : filterVariant === "number" ? (
    <DebouncedInput
      type="number"
      value={(columnFilterValue ?? "") as number}
      onChange={(value) => column.setFilterValue(value)}
      placeholder="#"
      className="border p-1 w-12"
    />
  ) : (
    <DebouncedInput
      className="border p-1 w-full"
      onChange={(value) => column.setFilterValue(value)}
      placeholder={`Filter`}
      type="text"
      value={(columnFilterValue ?? "") as string}
    />
  );
}

function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value, debounce, onChange]);

  return <input {...props} value={value} onChange={(e) => setValue(e.target.value)} />;
}
