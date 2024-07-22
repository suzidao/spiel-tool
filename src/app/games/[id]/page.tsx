/** @format */

import GameInfo from "@/app/components/GameInfo";

export default async function GamePage({ params: { id } }: { params: { id: string } }) {
  const rawdata = await fetch(`../../api/games/${id}`);
  const data = await rawdata.json();

  const game = data.data.entry;

  return (
    <div className="p-4 lg:p-24">
      <GameInfo game={game} />
    </div>
  );
}
