/** @format */
"use client";

import { normalizeText } from "@/utils/editData";
import BGGKeys from "@/data/bgg-keys.json";
import { DECISION } from "@/types/common";
import {
  ColumnFiltersState,
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";

import { Fragment, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import DataTable from "@/app/components/DataTable";
import { getGames } from "@/app/actions";
import Button from "@/app/components/Button";

export default function GamesPage() {
  const [data, setData] = useState<Game[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([
    { id: "AvailabilityStatus", value: "all" },
    {
      id: "SubTypes",
      value: ["boardgameexpansion", "boardgameintegration", "boardgamecompilation", "boardgameimplementation"],
    },
    { id: "DecisionStatus", value: ["none", "rejected", "evaluate", "alternate", "selected", "placed"] },
  ]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    YearPublished: false,
    SubTypes: false,
    BoardGameFamily: false,
    AvailabilityStatus: false,
    MinPlayers: false,
    MaxPlayers: false,
    MinPlaytime: false,
    MaxPlaytime: false,
    Complexity: false,
    Location: false,
  });

  useEffect(() => {
    getGames().then((res: Game[]) => setData(res));
  }, []);

  const columnHelper = createColumnHelper<Game>();

  const columns = useMemo(
    () => [
      columnHelper.accessor("decision", {
        id: "DecisionStatus",
        cell: (info) => {
          const status = info.getValue();

          switch (status) {
            case "none":
              return (
                <Link href={`/games/${info.row.original.gameid}`} className="text-xl -my-2">
                  🫥
                </Link>
              );
            case "rejected":
              return (
                <Link href={`/games/${info.row.original.gameid}`} className="text-xl -my-2">
                  🚫
                </Link>
              );
            case "evaluate":
              return (
                <Link href={`/games/${info.row.original.gameid}`} className="text-xl -my-2">
                  ⚖️
                </Link>
              );
            case "alternate":
              return (
                <Link href={`/games/${info.row.original.gameid}`} className="text-xl -my-2">
                  ⭐️
                </Link>
              );
            case "selected":
              return (
                <Link href={`/games/${info.row.original.gameid}`} className="text-xl -my-2">
                  ✅
                </Link>
              );
            case "placed":
              return (
                <Link href={`/games/${info.row.original.gameid}`} className="text-xl -my-2">
                  💜
                </Link>
              );
          }
        },
        header: () => <span className="text-xl">🧑‍⚖️</span>,
        enableColumnFilter: false,
        sortingFn: (rowA, rowB, _columnId) => {
          const statusA = rowA.original.decision;
          const statusB = rowB.original.decision;
          const statusOrder = ["placed", "selected", "alternate", "evaluate", "none", "rejected"];
          return statusOrder.indexOf(statusA) - statusOrder.indexOf(statusB);
        },
        filterFn: (row: Row<Game>, _columnId: string, filterValue: string[]) => {
          const status = row.original.decision;
          if (filterValue.length === 0) {
            return true;
          } else {
            return filterValue.includes(status);
          }
        },
        meta: {
          columnName: "Decision",
          filterVariant: "checklist",
          externalFilter: true,
          filterList: Object.entries(DECISION).map(([key, value]) => {
            return { objectid: key, name: value };
          }),
        },
      }),
      columnHelper.accessor("title", {
        id: "GameTitle",
        cell: ({ row }) => {
          const game = row.original;
          return (
            <div className="flex flex-row gap-2 items-center justify-start" key={game.gameid}>
              <Link href={`/games/${game.gameid}`} className="text-lg -my-1" scroll={false}>
                ℹ️
              </Link>
              {game.bggid ? (
                <Link href={`https://boardgamegeek.com/boardgame/${game.bggid}`} target="_blank">
                  {game.title}
                </Link>
              ) : (
                <>{game.title}</>
              )}
            </div>
          );
        },
        header: () => <span>Game Title</span>,
        sortingFn: "text",
        enableHiding: false,
        filterFn: (row: Row<Game>, _columnId: string, filterValue: string) => {
          return normalizeText(row.original.title!).includes(filterValue);
        },
      }),
      columnHelper.accessor("publisher.name", {
        id: "Publisher",
        cell: ({ row }) => {
          const game = row.original;
          return game.publisher.bggid ? (
            <Link
              key={game.publisher.publisherid}
              href={`https://boardgamegeek.com/publisher/${game.publisher.bggid}`}
              target="_blank"
            >
              {game.publisher.name}
            </Link>
          ) : (
            <Fragment key={game.publisher.publisherid}>{game.publisher.name}</Fragment>
          );
        },
        header: () => <span>Publisher</span>,
        sortingFn: "text",
        enableHiding: false,
        filterFn: (row: Row<Game>, _columnId: string, filterValue: string) => {
          return normalizeText(row.original.publisher.name).includes(filterValue);
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

              return designer.bggid ? (
                <Fragment key={`${row.index}-${designer.designerid}-${game.gameid}`}>
                  <Link href={`https://boardgamegeek.com/boardgamedesigner/${designer.bggid}`} target="_blank">
                    {designer.name}
                  </Link>
                  {!isLast && ", "}
                </Fragment>
              ) : (
                <Fragment key={`${row.index}-${designer.designerid}-${game.gameid}`}>
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
        filterFn: (row: Row<Game>, _columnId: string, filterValue: string) => {
          const designers = row.original.designers;
          return designers
            .map((designer) => {
              return normalizeText(designer.name).includes(filterValue);
            })
            .includes(true);
        },
        meta: {
          columnName: "Designer(s)",
        },
      }),
      columnHelper.accessor("location", {
        id: "Location",
        cell: (info) => {
          const location = info.getValue();
          return location ? location : "–";
        },
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
          headerClasses: "items-center text-center text-xl",
          classes: "text-center min-w-12",
        },
      }),
      columnHelper.accessor("releasedate", {
        id: "ReleaseDate",
        cell: (info) => {
          const date = info.getValue();
          return date ? date : "–";
        },
        header: () => <span>Release Date</span>,
        enableColumnFilter: false,
        meta: {
          columnName: "Release Date",
          headerClasses: "items-center",
          classes: "whitespace-nowrap",
        },
      }),
      columnHelper.group({
        id: "InterestStats",
        header: () => <span>Interest Stats</span>,
        meta: {
          columnName: "Interest Stats",
          headerClasses: "text-center pt-2",
        },
        columns: [
          columnHelper.accessor("musthave_stats", {
            id: "MustHaveStats",
            cell: (info) => {
              const statsNum = info.getValue();
              return statsNum > 0 ? statsNum : "–";
            },
            header: () => <span>😍</span>,
            sortDescFirst: true,
            enableColumnFilter: false,
            meta: {
              columnName: "Must Have",
              headerClasses: "text-center font-normal text-xl",
              classes: "text-center",
              hasPair: true,
            },
          }),
          columnHelper.accessor("interested_stats", {
            id: "InterestedStats",
            cell: (info) => {
              const statsNum = info.getValue();
              return statsNum > 0 ? statsNum : "–";
            },
            header: () => <span>😗</span>,
            sortDescFirst: true,
            enableColumnFilter: false,
            meta: {
              columnName: "Interested",
              headerClasses: "text-center font-normal text-xl",
              classes: "text-center",
              hasPair: true,
            },
          }),
          columnHelper.accessor("undecided_stats", {
            id: "UndecidedStats",
            cell: (info) => {
              const statsNum = info.getValue();
              return statsNum > 0 ? statsNum : "–";
            },
            header: () => <span>🤔</span>,
            sortDescFirst: true,
            enableColumnFilter: false,
            meta: {
              columnName: "Undecided",
              headerClasses: "text-center font-normal text-xl",
              classes: "text-center",
              hasPair: true,
            },
          }),
          columnHelper.accessor("combined_stats", {
            id: "CombinedStats",
            cell: (info) => {
              const statsNum = info.getValue();
              return statsNum > 0 ? statsNum : "–";
            },
            header: () => <span>𝚺</span>,
            sortDescFirst: true,
            enableColumnFilter: false,
            meta: {
              columnName: "Combined",
              headerClasses: "text-center font-normal text-xl",
              classes: "text-center",
              pairedColumns: ["InterestedStats", "MustHaveStats", "UndecidedStats"],
            },
          }),
        ],
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
              pairedColumns: ["MaxPlayers"],
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
              pairedColumns: ["MaxPlaytime"],
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
        filterFn: (row: Row<Game>, _columnId: string, filterValue: string) => {
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
        filterFn: (row: Row<Game>, _columnId: string, filterValue: string[]) => {
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
                <Fragment key={family.objectid + idx}>
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
        filterFn: (row: Row<Game>, _columnId: string, filterValue: string[]) => {
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
    ],
    [data]
  );

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

  return !!data ? (
    <div className="flex min-h-screen flex-col p-6 lg:p-24">
      <Link href="/games/add">
        <Button btnText="Add New Game" btnColor="green" />
      </Link>
      <DataTable table={table} />
    </div>
  ) : (
    <div>No Games Found</div>
  );
}
