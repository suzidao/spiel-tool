/** @format */

import GameInfo from "@/app/components/GameInfo";

export default async function GamePage({ params: { id } }: { params: { id: string } }) {
  const rawdata = await fetch(`http://localhost:3000/api/games/${id}`);
  const data = await rawdata.json();

  const game = data.data.entry;

  return (
    <div className="p-4 lg:p-24 mx-auto">
      <GameInfo game={game} />
    </div>
  );
}
