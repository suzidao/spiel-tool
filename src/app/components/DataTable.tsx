/** @format */

"use client";

import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import Link from "next/link";
import { Fragment } from "react";

export default function DataTable(props: { games: Entry[] }) {
  const data = props.games;

  const columnHelper = createColumnHelper<Entry>();

  const columns = [
    columnHelper.accessor("geekitem.item", {
      id: "GameTitle",
      cell: (info) => {
        const game = info.getValue();
        return (
          <Link key={game.primaryname.nameid} href={`https://boardgamegeek.com${game.href}`} target="_blank">
            {game.primaryname.name}
          </Link>
        );
      },
      header: () => <span>Game Title</span>,
    }),
    columnHelper.accessor("publishers", {
      id: "Publisher",
      cell: (info) => {
        const publisher = info.getValue()[0];
        return (
          <Link key={publisher.item.objectid} href={`https://boardgamegeek.com${publisher.item.href}`} target="_blank">
            {publisher.item.primaryname.name}
          </Link>
        );
      },
      header: () => <span>Publisher</span>,
    }),
    columnHelper.accessor("geekitem.item.links.boardgamedesigner", {
      id: "Designers",
      cell: (info) =>
        info.getValue().map((designer, idx) => {
          const isLast = info.getValue().length - 1 === idx;
          const designerLink = (
            <Fragment key={designer.objectid}>
              <Link href={designer.canonical_link} target="_blank">
                {designer.name}
              </Link>
              {!isLast && ", "}
            </Fragment>
          );
          return designerLink;
        }),
      header: () => <span>Designers</span>,
    }),
    columnHelper.accessor("location", {
      id: "Location",
      cell: (info) => info.getValue(),
      header: () => <span>Location</span>,
    }),
    columnHelper.accessor("reactions.thumbs", {
      id: "Thumbs",
      cell: (info) => {
        const thumbs = Number(info.getValue());
        return thumbs > 0 ? thumbs : "–";
      },
      header: () => <span>👍</span>,
    }),
    columnHelper.accessor("version.item.releasedate", {
      id: "ReleaseDate",
      cell: (info) => info.getValue(),
      header: () => <span>Release Date</span>,
    }),
    columnHelper.accessor("geekitem.item.minplayers", {
      id: "MinPlayers",
      cell: (info) => {
        const minplayers = Number(info.getValue());
        return minplayers > 0 ? minplayers : "–";
      },
      header: () => <span>Min Players</span>,
    }),
    columnHelper.accessor("geekitem.item.maxplayers", {
      id: "MaxPlayers",
      cell: (info) => {
        const maxplayers = Number(info.getValue());
        return maxplayers > 0 ? maxplayers : "–";
      },
      header: () => <span>Max Players</span>,
    }),
    columnHelper.accessor("geekitem.item.minplaytime", {
      id: "MinPlaytime",
      cell: (info) => {
        const minplaytime = Number(info.getValue());
        return minplaytime > 0 ? minplaytime : "–";
      },
      header: () => <span>Min Playtime</span>,
    }),
    columnHelper.accessor("geekitem.item.maxplaytime", {
      id: "MaxPlaytime",
      cell: (info) => {
        const maxplaytime = Number(info.getValue());
        return maxplaytime > 0 ? maxplaytime : "–";
      },
      header: () => <span>Max Playtime</span>,
    }),
    columnHelper.accessor<(row: Entry) => string, string>((row) => row.geekitem.item.dynamicinfo.item.stats.avgweight, {
      id: "Complexity",
      cell: (info) => {
        const avgweight = Number(info.getValue());
        return avgweight > 0 ? avgweight.toFixed(2) : "–";
      },
      header: () => <span>Complexity</span>,
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table>
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th key={header.id}>
                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
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
                <td key={cell.id} className="border-b border-gray-400 leading-5 px-1 py-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
