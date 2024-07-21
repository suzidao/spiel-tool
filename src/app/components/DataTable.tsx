/** @format */

"use client";

import BGGKeys from "../../data/bgg-keys.json";

import {
  Column,
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
  }
}

export default function DataTable(props: { data: Entry[] }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([{ id: "AvailabilityStatus", value: "all" }]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    YearPublished: false,
    SubTypes: false,
    BoardGameFamily: false,
    AvailabilityStatus: false,
  });

  const data = props.data;

  const columnHelper = createColumnHelper<Entry>();

  const columns = [
    columnHelper.accessor("geekitem.item.primaryname.name", {
      id: "GameTitle",
      cell: ({ row }) => {
        const game = row.original.geekitem.item;
        return (
          <Fragment key={game.primaryname.nameid}>
            <Link href={`/games/${row.original.objectid}`} className="mr-2" scroll={false}>
              ℹ️
            </Link>
            <Link href={`https://boardgamegeek.com${game.href}`} target="_blank">
              {row.original.version.item.name}
            </Link>
          </Fragment>
        );
      },
      header: () => <span>Game Title</span>,
      sortingFn: "text",
      enableHiding: false,
    }),
    columnHelper.accessor<(row: Entry) => string, string>((row) => row.publishers[0].item.primaryname.name, {
      id: "Publisher",
      cell: ({ row }) => {
        const publisher = row.original.publishers[0];
        return (
          <Link key={publisher.item.objectid} href={`https://boardgamegeek.com${publisher.item.href}`} target="_blank">
            {publisher.item.primaryname.name}
          </Link>
        );
      },
      header: () => <span>Publisher</span>,
      sortingFn: "text",
      enableHiding: false,
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
      header: () => <span>Designer(s)</span>,
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
    columnHelper.accessor("reactions.thumbs", {
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
    columnHelper.accessor("version.item.releasedate", {
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
      enableHiding: true,
      meta: {
        columnName: "Player Count",
        headerClasses: "text-center",
      },
      columns: [
        columnHelper.accessor("geekitem.item.minplayers", {
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
          },
        }),
        columnHelper.accessor("geekitem.item.maxplayers", {
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
          },
        }),
      ],
    }),
    columnHelper.group({
      id: "Playtime",
      header: () => <span>Playtime</span>,
      meta: {
        columnName: "Playtime",
        headerClasses: "text-center",
      },
      columns: [
        columnHelper.accessor("geekitem.item.minplaytime", {
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
          },
        }),
        columnHelper.accessor("geekitem.item.maxplaytime", {
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
          },
        }),
      ],
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
      filterFn: (row: Row<Entry>, _columnId: string, filterValue: string) => {
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
    columnHelper.accessor("geekitem.item.yearpublished", {
      id: "YearPublished",
      cell: (info) => Number(info.getValue()),
      header: () => <span>Year</span>,
      sortDescFirst: true,
      filterFn: "inNumberRange",
      meta: {
        columnName: "Earliest Publication Year",
        filterVariant: "min",
        filterMax: 3000,
        filterClasses: "w-16",
        externalFilter: true,
      },
    }),
    columnHelper.accessor("geekitem.item.subtypes", {
      id: "SubTypes",
      cell: (info) => {
        const subtypes = info.getValue();
        if (subtypes.length > 0) {
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
      filterFn: (row: Row<Entry>, _columnId: string, filterValue: string[]) => {
        const subtypes = row.original.geekitem.item.subtypes;

        return !subtypes
          .map((subtype) => {
            const filteredTypes = filterValue.map((filter) => {
              return filter === subtype;
            });
            return filteredTypes.includes(true);
          })
          .includes(true);
      },
      meta: {
        columnName: "Exclude Subtypes",
        filterVariant: "checklist",
        externalFilter: true,
        filterList: BGGKeys.excluded_subtypes,
      },
    }),
    columnHelper.accessor("geekitem.item.links.boardgamefamily", {
      id: "BoardGameFamily",
      cell: (info) => {
        const families = info.getValue();
        if (families.length > 0) {
          return families.map((family, idx) => {
            const isLast = families.length - 1 === idx;
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
      filterFn: (row: Row<Entry>, _columnId: string, filterValue: string[]) => {
        const families = row.original.geekitem.item.links.boardgamefamily;
        const matches = families.map((family) => {
          const filteredTypes = filterValue.map((filter) => {
            const matchFound = filter === family.objectid;
            return matchFound;
          });
          return filteredTypes.includes(true);
        });
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
      <div className="py-2">
        Total Games: <strong>{table.getFilteredRowModel().rows.length}</strong> |{" "}
        <strong>{table.getCoreRowModel().rows.length}</strong>
      </div>
      <div className="flex flex-wrap gap-2 py-2 mb-2 border-b border-black">
        <div className="font-semibold">Hide/Show Columns:</div>
        {table.getAllLeafColumns().map((column) => {
          return (
            column.columnDef.enableHiding !== false &&
            column.columnDef.meta?.externalFilter !== true && (
              <div key={column.id} className="px-1">
                <label className="flex align-middle gap-2">
                  <input
                    {...{
                      type: "checkbox",
                      checked: column.getIsVisible(),
                      onChange: column.getToggleVisibilityHandler(),
                    }}
                  />{" "}
                  {column.columnDef.meta?.columnName}
                </label>
              </div>
            )
          );
        })}
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {table.getAllColumns().map((column) => {
          return column.columnDef.meta?.externalFilter ? (
            <div
              key={column.id + "-filter"}
              className="flex flex-col flex-wrap items-start lg:items-center gap-2 mr-2 lg:flex-nowrap lg:flex-row"
            >
              <span className="font-semibold whitespace-nowrap">{column.columnDef.meta.columnName}: </span>
              <Filter column={column} />
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

function Filter({ column }: { column: Column<any, unknown> }) {
  const columnFilterValue = column.getFilterValue();
  const { filterVariant } = column.columnDef.meta ?? {};
  const checkChecklist = (columnFilterValue: string[], filterName?: string) => {
    const checklist = column.columnDef.meta?.filterList?.map((filterItem) => {
      return filterItem.objectid;
    });
    return filterName ? columnFilterValue.includes(filterName) : columnFilterValue.length === checklist!.length;
  };

  return filterVariant === "range" ? (
    <div className="flex space-x-2">
      {/* See faceted column filters example for min max values functionality */}
      <DebouncedInput
        type="number"
        value={(columnFilterValue as [number, number])?.[0] ?? ""}
        onChange={(value) => column.setFilterValue((old: [number, number]) => [value, old?.[1]])}
        min={1}
        placeholder={`Min`}
        className="border p-1 w-12"
      />
      <DebouncedInput
        type="number"
        value={(columnFilterValue as [number, number])?.[1] ?? ""}
        onChange={(value) => column.setFilterValue((old: [number, number]) => [old?.[0], value])}
        min={1}
        placeholder={`Max`}
        className="border p-1 w-12"
      />
    </div>
  ) : filterVariant === "min" ? (
    <DebouncedInput
      type="number"
      value={(columnFilterValue as [number, number])?.[0] ?? ""}
      onChange={(value) => column.setFilterValue([value, column.columnDef.meta?.filterMax ?? 9999])}
      max={column.columnDef.meta?.filterMax}
      placeholder={`Min`}
      className={"border p-1 " + (column.columnDef.meta?.filterClasses && column.columnDef.meta?.filterClasses)}
    />
  ) : filterVariant === "max" ? (
    <DebouncedInput
      type="number"
      value={(columnFilterValue as [number, number])?.[1] ?? ""}
      onChange={(value) => column.setFilterValue([column.columnDef.meta?.filterMin ?? 1, value])}
      min={1}
      placeholder={`Max`}
      className="border p-1 w-12"
    />
  ) : filterVariant === "number" ? (
    <DebouncedInput
      type="number"
      value={(columnFilterValue ?? "") as number}
      onChange={(value) => column.setFilterValue(value)}
      placeholder="#"
      className="border p-1 w-12"
    />
  ) : filterVariant === "checklist" ? (
    <div key={column.id} className="px-1 flex flex-wrap gap-1">
      <label className="flex font-semibold items-center gap-1 py-1 mr-4">
        <input
          {...{
            type: "checkbox",
            checked: checkChecklist((columnFilterValue ?? []) as string[]),
            onChange: () => {
              const filterValue = (columnFilterValue ?? []) as string[];
              const checklist = column.columnDef.meta?.filterList?.map((filterItem) => {
                return filterItem.objectid;
              });
              filterValue.length === checklist!.length ? column.setFilterValue("") : column.setFilterValue(checklist);
            },
          }}
        />
        All
      </label>
      {column.columnDef.meta?.filterList &&
        column.columnDef.meta?.filterList.map((filterItem) => (
          <label key={filterItem.objectid} className="flex items-center gap-2 py-1 mr-4 whitespace-nowrap">
            <input
              type="checkbox"
              name={column.columnDef.id}
              value={filterItem.objectid}
              checked={checkChecklist((columnFilterValue ?? []) as string[], filterItem.objectid)}
              onChange={(e: any) => {
                const target: string = e.target.value;
                const oldValue = (columnFilterValue ?? []) as string[];
                const newValue = oldValue.includes(target)
                  ? oldValue.filter((type) => type !== target)
                  : [target, ...oldValue];
                column.setFilterValue(newValue);
              }}
            />
            {filterItem.name}
          </label>
        ))}
    </div>
  ) : filterVariant === "radio" ? (
    <div key={column.id} className="px-1 flex flex-row gap-2">
      <fieldset className="flex row-wrap gap-2">
        {column.columnDef.meta?.filterList &&
          column.columnDef.meta?.filterList.map((filterItem, idx) => (
            <label
              key={filterItem.objectid}
              className="flex items-center gap-2 py-1 pr-2 whitespace-nowrap first-of-type:font-semibold"
            >
              <input
                type="radio"
                defaultChecked={idx === 0}
                name={column.columnDef.id}
                value={filterItem.objectid}
                onChange={(e: any) => {
                  const target: string = e.target.value;
                  column.setFilterValue(target);
                }}
              />
              {filterItem.name}
            </label>
          ))}
      </fieldset>
    </div>
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
  debounce = 1000,
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
