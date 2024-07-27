/** @format */
"use client";

import { useEffect, useState } from "react";
import bggData from "../../data/spiel-preview-games.json";
import parentData from "../../data/spiel-preview-parents.json";

import { scrapePreview, getItemIds } from "../actions";

export default function AdminPage() {
  const [gameIds, setGameIds] = useState<string[]>([]);

  const gamesData = bggData as Entry[];
  const metaData = parentData as PublisherMeta[];

  useEffect(() => {
    getItemIds().then((res) => setGameIds(res));
  }, []);

  return (
    <div className="flex justify-between p-24">
      <div>
        <div>total games: {gamesData.length}</div>
        <div className="mb-4">total publishers {metaData.length}</div>
        <div className="mb-4">game ids to be added:</div>
        {!!gameIds &&
          gameIds.map((itemid: string) => {
            return <div key={itemid}>{itemid}</div>;
          })}
      </div>
      <div>
        <button className="p-2 mx-2" onClick={() => scrapePreview(66, "spiel-preview-games.json")}>
          Scrape Preview Items
        </button>
        |
        <button className="p-2 mx-2" onClick={() => scrapePreview(4, "spiel-preview-parents.json", true)}>
          Scrape Parent Items
        </button>
      </div>
    </div>
  );
}
