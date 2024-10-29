/** @format */

import { extendGame } from "@/utils/editData";
import GameInfo from "@/app/components/GameInfo";

export default async function GamePage({ params: { id } }: { params: { id: string } }) {
  const rawdata = await fetch(`http://localhost:3000/api/games/${id}`, {
    method: "GET",
    cache: "no-cache",
  });
  const game = await rawdata.json();

  return (
    <div className="p-4 lg:p-24 flex justify-center">
      <div className="bg-white lg:min-w-[960px]">
        <GameInfo game={game} />
      </div>
    </div>
  );
}
