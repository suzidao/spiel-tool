/** @format */

import Link from "next/link";
import DataTable from "../components/DataTable";

export default async function GamesPage() {
  const games = await fetch("http://localhost:3000/api/games", { cache: "no-store" }).then((data) => data.json());

  return !!games ? (
    <div className="flex min-h-screen flex-col p-6 lg:p-24">
      <Link href="/games/add">Add New Game</Link>
      <DataTable data={games} />
    </div>
  ) : (
    <div>No Games Found</div>
  );
}
