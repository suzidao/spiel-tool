/** @format */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { scrapePreview, getNewGames, addBGGData } from "../actions";
import bggData from "../../data/spiel-preview-games.json";
import parentData from "../../data/spiel-preview-parents.json";

export default function AdminPage() {
  const [gameIds, setGameIds] = useState<string[]>([]);

  const gamesData = bggData as unknown as ImportedData[];
  const metaData = parentData as PublisherMeta[];

  useEffect(() => {
    getNewGames().then((res) => setGameIds(res));
  }, []);

  return (
    <div className="flex justify-between p-24">
      <div>
        <div>total games: {gamesData.length}</div>
        <div className="mb-4">total publishers: {metaData.length}</div>
        <div>total new games: {gameIds.length}</div>
        <button className="p-2 mx-2" onClick={() => addBGGData()}>
          Add New Games
        </button>
        <Link href="/games/add">Add New Game</Link>
      </div>
      {!!gameIds && (
        <div>
          <h2>NEW GAMES:</h2>
          <ul>
            {gameIds.map((id) =>
              gamesData.map((game) => game.itemid === id && <li key={game.itemid}>{game.version.item.name}</li>)
            )}
          </ul>
        </div>
      )}
      <div>
        <button className="p-2 mx-2" onClick={() => scrapePreview(78, "spiel-preview-games.json")}>
          Scrape Preview Items
        </button>
        |
        <button className="p-2 mx-2" onClick={() => scrapePreview(5, "spiel-preview-parents.json", true)}>
          Scrape Parent Items
        </button>
      </div>
    </div>
  );
}
