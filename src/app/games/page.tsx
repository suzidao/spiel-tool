/** @format */

import DataTable from "../components/DataTable";

export default async function GamesPage() {
  const rawdata = await fetch("http://localhost:3000/api/games", { cache: "no-store" });
  const games = await rawdata.json();

  return (
    <div className="flex min-h-screen flex-col p-6 lg:p-24">
      <DataTable data={games} />
    </div>
  );
}
