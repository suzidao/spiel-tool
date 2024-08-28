/** @format */

"use client";

import { useState } from "react";
import Filters from "./Filters";

import { flexRender, RowData, Table } from "@tanstack/react-table";
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
    pairedColumns?: string[];
    hasPair?: boolean;
  }
}

export default function DataTable(props: { table: Table<any> }) {
  const table = props.table;
  const hideAll =
    table.getAllLeafColumns().filter((column) => column.columnDef.enableHiding === false).length ===
    table.getAllLeafColumns().length;
  return (
    <>
      <div className="flex justify-between items-center mb-2 border-b border-black pb-3">
        <div>
          Total Games: <strong>{table.getFilteredRowModel().rows.length}</strong> |{" "}
          <strong>{table.getCoreRowModel().rows.length}</strong>
        </div>
        {!hideAll && (
          <div className="flex flex-wrap gap-2">
            <div className="font-semibold">Hide/Show Columns:</div>
            {table.getAllLeafColumns().map((column: any) => {
              const pairedColumns = column.columnDef.meta?.pairedColumns;
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
                            if (pairedColumns) {
                              for (let i = 0; i < pairedColumns.length; i++) {
                                table.getColumn(pairedColumns[i])?.toggleVisibility();
                              }
                            }

                            column.toggleVisibility();
                          },
                        }}
                      />{" "}
                      {pairedColumns ? column.parent?.columnDef.meta?.columnName : column.columnDef.meta?.columnName}
                    </label>
                  </div>
                ))
              );
            })}
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {table.getAllColumns().map((column: any) => {
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
          {table.getHeaderGroups().map((headerGroup: any) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header: any) => (
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
                        <span className="text-sm font-medium">
                          {{
                            asc: " ↑",
                            desc: " ↓",
                          }[header.column.getIsSorted() as string] ?? null}
                        </span>
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
          {table.getRowModel().rows.map((row: any) => (
            <tr key={row.id} className="even:bg-gray-200">
              {row.getVisibleCells().map((cell: any) => {
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
