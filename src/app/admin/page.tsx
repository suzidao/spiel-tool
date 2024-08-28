/** @format */
"use client";

import { useEffect, useState } from "react";
import { scrapePreview, getNewGames, addBGGData, scrapeSPIEL, importSPIELData } from "../actions";
import bggData from "../../data/spiel-preview-games.json";
import parentData from "../../data/spiel-preview-parents.json";
import SPIELData from "../../data/spiel-app-games.json";

export default function AdminPage() {
  const [gameIds, setGameIds] = useState<string[]>([]);
  const [newSPIELgames, setNewSPIELGames] = useState<SPIELProductData[]>([]);

  const BGGGames = bggData as unknown as ImportedData[];
  const metaData = parentData as PublisherMeta[];
  const SPIELGames = SPIELData as SPIELProductData[];

  useEffect(() => {
    getNewGames().then((res) => {
      setGameIds(res.newDBgames);
      setNewSPIELGames(res.newSPIELgames);
    });
  }, []);

  return (
    <div className="flex flex-row p-12">
      <div className="flex flex-col gap-4 items-center w-1/2">
        <div className="flex flex-row">
          <div className="flex flex-col gap-4 items-center justify-center">
            <button
              className="bg-orange-300/60 hover:bg-orange-400/80 border border-orange-500 font-medium mx-2 px-3 py-1 rounded text-xs uppercase"
              onClick={() => scrapePreview(88, "spiel-preview-games.json")}
            >
              Scrape BGG Preview Items
            </button>
            <div className="text-lg">
              BGG Games:{" "}
              {gameIds.length > 0 && (
                <>
                  <span className="font-bold">{gameIds.length}</span>
                  {" | "}
                </>
              )}
              {BGGGames.length}
            </div>
          </div>
          <div className="flex flex-col gap-4 items-center justify-center">
            <button
              className="bg-orange-300/60 hover:bg-orange-400/80 border border-orange-500 font-medium mx-2 px-3 py-1 rounded text-xs uppercase"
              onClick={() => scrapePreview(6, "spiel-preview-parents.json", true)}
            >
              Scrape BGG Parent Items
            </button>
            <div className="text-lg">BGG Publishers: {metaData.length}</div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center">
          <button
            className="bg-yellow-300/60 enabled:hover:bg-yellow-400/80 disabled:opacity-70 disabled:bg-yellow-200/50 disabled:border-yellow-400 disabled:text-gray-600 border border-yellow-500 font-medium mx-2 px-3 py-1 rounded text-xs uppercase"
            onClick={() => addBGGData()}
            disabled={gameIds.length === 0}
          >
            Add New Games
          </button>

          {gameIds.length > 0 && (
            <table className="mt-12">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Publisher</th>
                  <th>???</th>
                </tr>
              </thead>
              <tbody>
                {gameIds.map((id) =>
                  BGGGames.map(
                    (game) =>
                      game.itemid === id && (
                        <tr key={game.itemid}>
                          <td className="p-3">{game.geekitem.item.primaryname.name}</td>
                          <td className="p-3">{game.publishers[0].item.primaryname.name}</td>
                          <td className="p-3">
                            {" "}
                            <button
                              className="bg-teal-300/60 hover:bg-teal-400/80 border border-teal-500 transition-all ease-in-out py-1 px-3 rounded text-xs font-medium uppercase"
                              onClick={() => {}}
                            >
                              Reconcile
                            </button>
                          </td>
                        </tr>
                      )
                  )
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-4 items-center w-1/2">
        <button
          className="bg-orange-300/60 hover:bg-orange-400/80 border border-orange-500 font-medium mx-2 px-3 py-1 rounded text-xs uppercase"
          onClick={() => scrapeSPIEL()}
        >
          Scrape SPIEL App
        </button>
        <div className="text-lg">
          SPIEL Games:{" "}
          {newSPIELgames.length > 0 && (
            <>
              <span className="font-bold">{newSPIELgames.length}</span>
              {" | "}
            </>
          )}
          {SPIELGames.length}
        </div>
        <button
          className="bg-yellow-300/60 enabled:hover:bg-yellow-400/80 disabled:opacity-70 disabled:bg-yellow-200/50 disabled:border-yellow-400 disabled:text-gray-600 border border-yellow-500 font-medium mx-2 px-3 py-1 rounded text-xs uppercase"
          onClick={() => importSPIELData()}
          disabled={newSPIELgames.length === 0}
        >
          Import SPIEL Games
        </button>
        {newSPIELgames.length > 0 && (
          <table className="mt-12">
            <thead>
              <tr>
                <th>Title</th>
                <th>Publisher</th>
                <th>???</th>
              </tr>
            </thead>
            <tbody>
              {newSPIELgames.map((game, idx) => (
                <tr key={idx + game.TITEL}>
                  <td className="p-3">{game.TITEL}</td>
                  <td className="p-3">{game.UNTERTITEL}</td>
                  <td className="p-3">
                    <button
                      className="bg-teal-300/60 hover:bg-teal-400/80 border border-teal-500 transition-all ease-in-out py-1 px-3 rounded text-xs font-medium uppercase"
                      onClick={() => {}}
                    >
                      Reconcile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
