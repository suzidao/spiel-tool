/** @format */

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { assignGame, toggleIgnore, getAllGames } from "@/app/actions";
import { normalizeText } from "@/utils/editData";
import DataTable from "@/app/components/DataTable";
import {
  ColumnFiltersState,
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  Row,
  RowData,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void;
  }
}

export default function ReconciliationPage() {
  const [dbGames, setDBGames] = useState<Game[]>([]);
  const [SPIELGames, setSPIELGames] = useState<SPIELGame[]>([]);
  const [matchTerm, setMatchTerm] = useState<string>("");
  const [results, setResults] = useState<Game[]>([]);
  const [gameMatch, setGameMatch] = useState<SPIELGame>();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  useEffect(() => {
    getAllGames().then((res) => {
      setSPIELGames(res.SPIELgames);
      setDBGames(res.games);
    });
  }, [gameMatch]);

  // may use in future for pagination implementation
  const useSkipper = () => {
    const shouldSkipRef = useRef(true);
    const shouldSkip = shouldSkipRef.current;

    // Wrap a function with this to skip a pagination reset temporarily
    const skip = useCallback(() => {
      shouldSkipRef.current = false;
    }, []);

    useEffect(() => {
      shouldSkipRef.current = true;
    });

    return [shouldSkip, skip] as const;
  };

  const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper();

  const columnHelper = createColumnHelper<SPIELGame>();

  const columns = [
    columnHelper.accessor("title", {
      id: "GameTitle",
      cell: ({ row }) => {
        return (
          <span className={row.original.spielid === gameMatch?.spielid ? "font-semibold" : ""}>
            {row.original.title}
          </span>
        );
      },
      header: () => <span>Title</span>,
      enableHiding: false,
    }),
    columnHelper.accessor("publisher", {
      id: "Publisher",
      cell: ({ row }) => {
        return (
          <span className={row.original.spielid === gameMatch?.spielid ? "font-semibold" : ""}>
            {row.original.publisher}
          </span>
        );
      },
      header: () => <span>Publisher</span>,
      enableHiding: false,
    }),
    columnHelper.accessor("gameid", {
      id: "gameid",
      cell: ({ row, row: { index }, column: { id }, table }) => {
        const game = row.original;

        return !!game.gameid ? (
          "✅"
        ) : (
          <button
            onClick={() => {
              setMatchTerm(game.title);
              match(game.title);
              setGameMatch(game);
              table.options.meta?.updateData(index, id, game.gameid);
            }}
          >
            Reconcile
          </button>
        );
      },
      header: () => <span>Reconcile</span>,
      enableHiding: false,
      enableColumnFilter: false,
      filterFn: (row: Row<SPIELGame>, _columnId: string, filterValue: string[]) => {
        const isMatched = !!row.original.gameid;

        return filterValue.length === 1 ? !isMatched : true;
      },
      meta: {
        columnName: "Exclude Matched Games",
        filterVariant: "checklist",
        externalFilter: true,
        filterList: [{ objectid: "matched", name: "" }],
      },
    }),
    columnHelper.accessor("ignore", {
      id: "ignore",
      cell: ({ row, row: { index }, column: { id }, table }) => {
        const game = row.original;
        const ignored = game.ignore;
        const [value, setValue] = useState(ignored);

        useEffect(() => {
          setValue(ignored);
        }, [ignored]);

        return (
          <input
            type="checkbox"
            checked={value}
            onChange={() => {
              setValue(value);
              toggleIgnore(game.spielid, value);
            }}
            onBlur={() => table.options.meta?.updateData(index, id, value)}
          />
        );
      },
      header: () => <span>Ignored</span>,
      enableHiding: false,
      enableColumnFilter: false,
      filterFn: (row: Row<SPIELGame>, _columnId: string, filterValue: string[]) => {
        const ignored = row.original.ignore;

        return filterValue.length === 1 ? !!ignored === false : true;
      },
      meta: {
        columnName: "Exclude Ignored Items",
        filterVariant: "checklist",
        externalFilter: true,
        filterList: [{ objectid: "ignore", name: "" }],
      },
    }),
  ];

  const table = useReactTable({
    data: SPIELGames,
    columns,
    filterFns: {},
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(), //client side filtering
    getSortedRowModel: getSortedRowModel(), //client-side sorting
    onSortingChange: setSorting,
    enableSortingRemoval: false,
    state: {
      columnFilters,
      sorting,
    },
    autoResetPageIndex,
    meta: {
      updateData: (rowIndex: number, columnId: string, value: any) => {
        setSPIELGames((old) => {
          return old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex]!,
                [columnId]: value,
              };
            }
            return row;
          });
        });
      },
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let term = e.target.value;
    setMatchTerm(term);
    match(term);
  };

  const match = (term: string) => {
    const filteredResults = dbGames.filter((game) => {
      return normalizeText(game.title).includes(normalizeText(term));
    });

    term !== "" ? setResults(filteredResults) : setResults([]);
  };

  return (
    <div className="w-1/2 p-12">
      <DataTable table={table} />
      <div className="w-1/2 fixed right-0 top-0 p-12">
        <p className="flex gap-2 justify-start items-center">
          Currenting matching: <strong>{gameMatch?.title}</strong>
          {!!gameMatch && (
            <button
              className="ml-4 font-black text-red-600"
              onClick={() => {
                setGameMatch(undefined);
                setMatchTerm("");
                setResults([]);
              }}
            >
              x
            </button>
          )}
        </p>
        <input className="my-4" type="text" name="match" value={matchTerm} size={60} onChange={handleChange} />
        <table>
          <thead>
            <tr>
              <th className="px-3">Select</th>
              <th className="px-3">Title</th>
              <th className="px-3">Publisher</th>
            </tr>
          </thead>
          <tbody>
            {results.map((match: Game) => (
              <tr key={match.gameid}>
                <td className="p-3">
                  <button
                    onClick={() => {
                      assignGame(gameMatch!.spielid, match.gameid);
                      setGameMatch(undefined);
                      setMatchTerm("");
                      setResults([]);
                    }}
                  >
                    Match
                  </button>
                </td>
                <td className="p-3">{match.title}</td>
                <td className="p-3">{match.publisher.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
