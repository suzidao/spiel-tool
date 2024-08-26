/** @format */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { scrapePreview, getNewGames, addBGGData, scrapeSPIEL, importSPIELData } from "../actions";
import bggData from "../../data/spiel-preview-games.json";
import parentData from "../../data/spiel-preview-parents.json";
import SPIELData from "../../data/spiel-app-games.json";

export default function AdminPage() {
  const [gameIds, setGameIds] = useState<string[]>([]);
  const [newSPIELgames, setNewSPIELGames] = useState<any[]>([]);

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
    <div className="flex justify-between p-24">
      <div>
        <div>total BGG games: {BGGGames.length}</div>
        <div className="mb-4">total publishers: {metaData.length}</div>
        <div>total new BGG games: {gameIds.length}</div>
        <button className="p-2 mx-2" onClick={() => addBGGData()}>
          Add New Games
        </button>
        <Link href="/games/add">Add New Game</Link>
      </div>
      <div>
        <div>total SPIEL games: {SPIELGames.length}</div>
        <div>total new SPIEL games: {newSPIELgames.length}</div>
        <button className="p-2 mx-2" onClick={() => importSPIELData()}>
          Import SPIEL Games
        </button>
      </div>
      {gameIds.length > 0 && (
        <div>
          <h2>NEW GAMES:</h2>
          <ul>
            {gameIds.map((id) =>
              BGGGames.map(
                (game) =>
                  game.itemid === id && (
                    <li key={game.itemid}>
                      {game.itemid} – {game.version.item.name}
                    </li>
                  )
              )
            )}
          </ul>
        </div>
      )}
      <div>
        <button className="p-2 mx-2" onClick={() => scrapePreview(106, "spiel-preview-games.json")}>
          Scrape Preview Items
        </button>
        |
        <button className="p-2 mx-2" onClick={() => scrapePreview(6, "spiel-preview-parents.json", true)}>
          Scrape BGG Parent Items
        </button>
        |
        <button className="p-2 mx-2" onClick={() => scrapeSPIEL()}>
          Scrape SPIEL App
        </button>
      </div>
    </div>
  );
}
