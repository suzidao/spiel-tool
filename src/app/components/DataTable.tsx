/** @format */

"use client";

import BGGKeys from "../../data/bgg-keys.json";
import Filters from "./Filters";

import {
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
  VisibilityState,
} from "@tanstack/react-table";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    columnName?: string;
    headerClasses?: string;
    classes?: string;
    filterClasses?: string;
    filterVariant?: "text" | "range" | "number" | "min" | "max" | "checklist" | "radio";
    filterMin?: number;
    filterMax?: number;
    externalFilter?: boolean;
    filterList?: { objectid: string; name: string }[];
    pairedColumn?: string;
    hasPair?: boolean;
  }
}

export default function DataTable(props: { data: CombinedGame[] }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([{ id: "AvailabilityStatus", value: "all" }]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    YearPublished: false,
    SubTypes: false,
    BoardGameFamily: false,
    AvailabilityStatus: false,
  });

  const data = props.data;

  const columnHelper = createColumnHelper<CombinedGame>();

  const columns = [
    columnHelper.accessor("title", {
      id: "GameTitle",
      cell: ({ row }) => {
        const game = row.original;
        return (
          <Fragment key={game.gameid}>
            <Link href={`/games/${row.original.gameid}`} className="mr-2" scroll={false}>
              ℹ️
            </Link>
            {game.game_link ? (
              <Link href={game.game_link} target="_blank">
                {row.original.title}
              </Link>
            ) : (
              <>{row.original.title}</>
            )}
          </Fragment>
        );
      },
      header: () => <span>Game Title</span>,
      sortingFn: "text",
      enableHiding: false,
      filterFn: (row: Row<CombinedGame>, _columnId: string, filterValue: string) => {
        return row.original
          .title!.normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
          .includes(filterValue);
      },
    }),
    columnHelper.accessor("publisher", {
      id: "Publisher",
      cell: ({ row }) => {
        const game = row.original;
        return game.publisher_link ? (
          <Link key={game.publisher} href={game.publisher_link} target="_blank">
            {game.publisher}
          </Link>
        ) : (
          <Fragment key={game.publisher}>{game.publisher}</Fragment>
        );
      },
      header: () => <span>Publisher</span>,
      sortingFn: "text",
      enableHiding: false,
      filterFn: (row: Row<CombinedGame>, _columnId: string, filterValue: string) => {
        return row.original.publisher
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
          .includes(filterValue);
      },
    }),
    columnHelper.accessor("designers", {
      id: "Designers",
      cell: ({ row }) => {
        const game = row.original;
        const designers = game.designers;
        if (!!designers && designers.length > 0) {
          return designers.map((designer, idx) => {
            const isLast = designers.length - 1 === idx;
            const designerLink = (
              <Fragment key={designer.objectid}>
                <Link href={designer.canonical_link!} target="_blank">
                  {designer.name}
                </Link>
                {!isLast && ", "}
              </Fragment>
            );
            return designer.canonical_link ? (
              designerLink
            ) : (
              <Fragment key={designer && idx}>
                {designer.name}
                {!isLast && ", "}
              </Fragment>
            );
          });
        } else {
          return "–";
        }
      },
      header: () => <span>Designer(s)</span>,
      enableSorting: false,
      filterFn: (row: Row<CombinedGame>, _columnId: string, filterValue: string) => {
        const designers = row.original.designers;
        return designers
          .map((designer) => {
            return designer.name
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .toLowerCase()
              .includes(filterValue);
          })
          .includes(true);
      },
      meta: {
        columnName: "Designer(s)",
      },
    }),
    columnHelper.accessor("location", {
      id: "Location",
      cell: (info) => info.getValue(),
      header: () => <span>Location</span>,
      sortingFn: "text",
      meta: {
        columnName: "Location",
      },
    }),
    columnHelper.accessor("thumbs", {
      id: "Thumbs",
      cell: (info) => {
        const thumbs = Number(info.getValue());
        return thumbs > 0 ? thumbs : "–";
      },
      header: () => <span>👍</span>,
      enableColumnFilter: false,
      meta: {
        columnName: "👍",
        headerClasses: "align-bottom pb-4 text-center",
        classes: "text-center min-w-12",
      },
    }),
    columnHelper.accessor("releasedate", {
      id: "ReleaseDate",
      cell: (info) => info.getValue(),
      header: () => <span>Release Date</span>,
      enableColumnFilter: false,
      meta: {
        columnName: "Release Date",
        headerClasses: "align-bottom pb-4",
        classes: "whitespace-nowrap",
      },
    }),
    columnHelper.group({
      id: "PlayerCount",
      header: () => <span>Player Count</span>,
      meta: {
        columnName: "Player Count",
        headerClasses: "text-center",
      },
      columns: [
        columnHelper.accessor("minplayers", {
          id: "MinPlayers",
          cell: (info) => {
            const minplayers = Number(info.getValue());
            return minplayers > 0 ? minplayers : "–";
          },
          header: () => <span>Min</span>,
          sortDescFirst: true,
          filterFn: "inNumberRange",
          meta: {
            columnName: "Min. Players",
            headerClasses: "text-center font-normal uppercase text-xs",
            classes: "text-center",
            filterClasses: "w-12",
            filterVariant: "min",
            pairedColumn: "MaxPlayers",
          },
        }),
        columnHelper.accessor("maxplayers", {
          id: "MaxPlayers",
          cell: (info) => {
            const maxplayers = Number(info.getValue());
            return maxplayers > 0 ? maxplayers : "–";
          },
          header: () => <span>Max</span>,
          sortDescFirst: true,
          filterFn: "inNumberRange",
          meta: {
            columnName: "Max. Players",
            headerClasses: "text-center font-normal uppercase text-xs",
            classes: "text-center",
            filterVariant: "max",
            hasPair: true,
          },
        }),
      ],
    }),
    columnHelper.group({
      id: "Playtime",
      header: () => <span>Play Time</span>,
      meta: {
        columnName: "Play Time",
        headerClasses: "text-center",
      },
      columns: [
        columnHelper.accessor("minplaytime", {
          id: "MinPlaytime",
          cell: (info) => {
            const minplaytime = Number(info.getValue());
            return minplaytime > 0 ? minplaytime : "–";
          },
          header: () => <span>Min</span>,
          sortDescFirst: true,
          filterFn: "inNumberRange",
          meta: {
            columnName: "Min. Playtime",
            headerClasses: "text-center font-normal uppercase text-xs",
            classes: "text-center",
            filterVariant: "min",
            filterClasses: "w-12",
            pairedColumn: "MaxPlaytime",
          },
        }),
        columnHelper.accessor("maxplaytime", {
          id: "MaxPlaytime",
          cell: (info) => {
            const maxplaytime = Number(info.getValue());
            return maxplaytime > 0 ? maxplaytime : "–";
          },
          header: () => <span>Max</span>,
          sortDescFirst: true,
          filterFn: "inNumberRange",
          meta: {
            columnName: "Max. Playtime",
            headerClasses: "text-center font-normal uppercase text-xs",
            classes: "text-center",
            filterVariant: "max",
            hasPair: true,
          },
        }),
      ],
    }),
    columnHelper.accessor("complexity", {
      id: "Complexity",
      cell: (info) => {
        const complexity = Number(info.getValue());
        return complexity > 0 ? complexity.toFixed(2) : "–";
      },
      header: () => <span>Complexity</span>,
      sortingFn: "basic",
      sortDescFirst: true,
      filterFn: "inNumberRange",
      meta: {
        columnName: "Complexity",
        headerClasses: "text-center",
        classes: "text-center",
        filterVariant: "min",
        filterClasses: "w-16",
        filterMax: 5,
      },
    }),
    columnHelper.accessor("availability_status", {
      id: "AvailabilityStatus",
      cell: (info) => info.getValue(),
      header: () => <span>Availability</span>,
      enableSorting: false,
      filterFn: (row: Row<CombinedGame>, _columnId: string, filterValue: string) => {
        if (filterValue === "all") {
          return true;
        } else {
          return row.original.availability_status === filterValue;
        }
      },
      meta: {
        columnName: "Availability",
        filterVariant: "radio",
        externalFilter: true,
        filterList: BGGKeys.availability_statuses,
      },
    }),
    columnHelper.accessor("yearpublished", {
      id: "YearPublished",
      cell: (info) => Number(info.getValue()),
      header: () => <span>Year</span>,
      enableSorting: false,
      filterFn: "inNumberRange",
      meta: {
        columnName: "Earliest Publication Year",
        filterVariant: "min",
        filterMax: 3000,
        filterClasses: "w-16",
        externalFilter: true,
      },
    }),
    columnHelper.accessor("subtypes", {
      id: "SubTypes",
      cell: (info) => {
        const subtypes = info.getValue();
        if (subtypes && subtypes.length > 0) {
          return subtypes.map((subtype, idx) => {
            const isLast = subtypes.length - 1 === idx;
            const subtypeList = (
              <Fragment key={subtype + idx}>
                {subtype}
                {!isLast && ", "}
              </Fragment>
            );
            return subtypeList;
          });
        } else {
          return "–";
        }
      },
      header: () => <span>SubTypes</span>,
      enableSorting: false,
      filterFn: (row: Row<CombinedGame>, _columnId: string, filterValue: string[]) => {
        const subtypes = row.original.subtypes;

        return subtypes
          ? !subtypes
              .map((subtype) => {
                const filteredTypes = filterValue.map((filter) => {
                  return filter === subtype;
                });
                return filteredTypes.includes(true);
              })
              .includes(true)
          : true;
      },
      meta: {
        columnName: "Exclude Subtypes",
        filterVariant: "checklist",
        externalFilter: true,
        filterList: BGGKeys.excluded_subtypes,
      },
    }),
    columnHelper.accessor("digitized", {
      id: "BoardGameFamily",
      cell: (info) => {
        const digitized = info.getValue();
        if (digitized && digitized.length > 0) {
          return digitized.map((family, idx) => {
            const isLast = digitized.length - 1 === idx;
            const familyList = (
              <Fragment key={family.objectid}>
                {family.objectid}
                {!isLast && ", "}
              </Fragment>
            );
            return familyList;
          });
        } else {
          return "–";
        }
      },
      header: () => <span>Digital Implementation(s)</span>,
      enableSorting: false,
      filterFn: (row: Row<CombinedGame>, _columnId: string, filterValue: string[]) => {
        const digitizations = row.original.digitized;
        const matches = digitizations
          ? digitizations.map((digitization) => {
              const filteredTypes = filterValue.map((filter) => {
                const matchFound = filter === digitization.objectid;
                return matchFound;
              });
              return filteredTypes.includes(true);
            })
          : [];
        if (filterValue.length === 0) {
          return true;
        } else {
          return matches.includes(true);
        }
      },
      meta: {
        columnName: "Digital Implementation(s)",
        filterVariant: "checklist",
        externalFilter: true,
        filterList: BGGKeys.digital_implementations,
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
    onColumnVisibilityChange: setColumnVisibility,
    enableSortingRemoval: false,
    state: {
      columnFilters,
      sorting,
      columnVisibility,
    },
  });

  return (
    <>
      <div className="flex justify-between items-center mb-2 border-b border-black pb-3">
        <div>
          Total Games: <strong>{table.getFilteredRowModel().rows.length}</strong> |{" "}
          <strong>{table.getCoreRowModel().rows.length}</strong>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="font-semibold">Hide/Show Columns:</div>
          {table.getAllLeafColumns().map((column) => {
            const pairedColumn = column.columnDef.meta?.pairedColumn;
            const hasPair = column.columnDef.meta?.hasPair;

            return (
              hasPair ??
              (column.columnDef.enableHiding !== false && column.columnDef.meta?.externalFilter !== true && (
                <div key={column.id} className="px-1">
                  <label className="flex align-middle gap-2">
                    <input
                      {...{
                        type: "checkbox",
                        checked: column.getIsVisible(),
                        onChange: () => {
                          if (pairedColumn) table.getColumn(pairedColumn!)?.toggleVisibility();
                          column.toggleVisibility();
                        },
                      }}
                    />{" "}
                    {pairedColumn ? column.parent?.columnDef.meta?.columnName : column.columnDef.meta?.columnName}
                  </label>
                </div>
              ))
            );
          })}
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {table.getAllColumns().map((column) => {
          return column.columnDef.meta?.externalFilter ? (
            <div
              key={column.id + "-filter"}
              className="flex flex-col flex-wrap items-start lg:items-center gap-2 mr-2 lg:flex-nowrap lg:flex-row"
            >
              <span className="font-semibold whitespace-nowrap">{column.columnDef.meta.columnName}: </span>
              <Filters column={column} />
            </div>
          ) : null;
        })}
      </div>
      <table>
        <thead className="bg-slate-200 sticky top-0">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  colSpan={header.colSpan}
                  className={
                    "text-left px-1 pt-2 " +
                    (header.column.columnDef.meta?.headerClasses && header.column.columnDef.meta?.headerClasses)
                  }
                >
                  {header.isPlaceholder ? null : (
                    <>
                      <div
                        className={header.column.getCanSort() ? "cursor-pointer select-none " : ""}
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
                          asc: " ↑",
                          desc: " ↓",
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                      {header.column.getCanFilter() ? (
                        <div
                          className={
                            "pt-1 pb-2 text-left text-sm font-normal " +
                            (header.column.columnDef.meta?.classes && header.column.columnDef.meta?.classes)
                          }
                        >
                          <Filters column={header.column} />
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
            <tr key={row.id} className="even:bg-gray-200">
              {row.getVisibleCells().map((cell) => {
                return (
                  <td
                    key={cell.id}
                    className={
                      "border-b border-gray-400 leading-5 px-1 py-2 " +
                      (cell.column.columnDef.meta?.classes && cell.column.columnDef.meta?.classes)
                    }
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
