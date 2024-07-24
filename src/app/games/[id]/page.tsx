/** @format */

import GameInfo from "@/app/components/GameInfo";

export default async function GamePage({ params: { id } }: { params: { id: string } }) {
  const rawdata = await fetch(`http://localhost:3000/api/games/${id}`);
  const { data } = await rawdata.json();

  const game = data.entry;

  return (
    <div className="p-4 lg:p-24 flex justify-center">
      <div className="bg-white p-16 lg:min-w-[960px]">
        <GameInfo game={game} />
      </div>
    </div>
  );
}
