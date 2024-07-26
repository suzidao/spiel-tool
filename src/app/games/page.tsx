/** @format */

import Link from "next/link";
import DataTable from "../components/DataTable";

export default async function GamesPage() {
  const rawdata = await fetch("http://localhost:3000/api/games", { cache: "no-store" });
  const games = await rawdata.json();

  return (
    <div className="flex min-h-screen flex-col p-6 lg:p-24">
      <div className="flex justify-between mb-8">
        <div>
          Total Games Listed: <strong>{games.length}</strong>
        </div>
        <div>
          <Link className="px-4 py-2" href="/api/scrapers/items">
            Download Games
          </Link>
          |
          <Link className="px-4 py-2" href="/api/scrapers/parents">
            Download Parents
          </Link>
        </div>
      </div>
      <DataTable data={games} />
    </div>
  );
}
