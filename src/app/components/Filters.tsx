/** @format */
"use client";

import { Column } from "@tanstack/react-table";
import { useEffect, useState } from "react";

export default function Filter({ column }: { column: Column<any, unknown> }) {
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
        id={column.id + "filtermin"}
        type="number"
        value={(columnFilterValue as [number, number])?.[0] ?? ""}
        onChange={(value) => column.setFilterValue((old: [number, number]) => [value, old?.[1]])}
        min={1}
        placeholder={`Min`}
        className="border p-1 w-12"
      />
      <DebouncedInput
        id={column.id + "filtermax"}
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
      id={column.id + "filter"}
      type="number"
      value={(columnFilterValue as [number, number])?.[0] ?? ""}
      onChange={(value) => column.setFilterValue([value, column.columnDef.meta?.filterMax ?? 9999])}
      max={column.columnDef.meta?.filterMax}
      min={1}
      placeholder={`Min`}
      className={"border p-1 " + (column.columnDef.meta?.filterClasses && column.columnDef.meta?.filterClasses)}
    />
  ) : filterVariant === "max" ? (
    <DebouncedInput
      id={column.id + "filter"}
      type="number"
      value={(columnFilterValue as [number, number])?.[1] ?? ""}
      onChange={(value) => column.setFilterValue([column.columnDef.meta?.filterMin ?? "", value])}
      min={1}
      placeholder={`Max`}
      className="border p-1 w-12"
    />
  ) : filterVariant === "number" ? (
    <DebouncedInput
      id={column.id + "filter"}
      type="number"
      value={(columnFilterValue ?? "") as number}
      onChange={(value) => column.setFilterValue(value)}
      placeholder="#"
      className="border p-1 w-12"
    />
  ) : filterVariant === "checklist" ? (
    <div key={column.id} className="px-1 flex flex-wrap gap-1">
      <label className="flex font-semibold items-center gap-1 py-1 mr-2">
        <input
          {...{
            id: column.id + "filter",
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
        {column.columnDef.meta?.filterList?.length && column.columnDef.meta?.filterList?.length > 1 ? "All" : ""}
      </label>
      {column.columnDef.meta?.filterList &&
        column.columnDef.meta?.filterList?.length > 1 &&
        column.columnDef.meta?.filterList.map((filterItem) => (
          <label key={filterItem.objectid} className="flex items-center gap-1 py-1 mr-2 whitespace-nowrap">
            <input
              id={filterItem.objectid + column.id}
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
              className="flex items-center gap-1 py-1 pr-1 whitespace-nowrap first-of-type:font-semibold"
            >
              <input
                id={filterItem.objectid + column.id}
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
      id={column.id + "filter"}
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
