/** @format */

import { extendGame } from "@/utils/editData";
import GameInfo from "@/app/components/GameInfo";

export default async function GamePage({ params: { id } }: { params: { id: string } }) {
  const rawdata = await fetch(`http://localhost:3000/api/games/${id}`, {
    method: "GET",
    cache: "no-store",
  });
  const game = await rawdata.json().then((res) => extendGame(res));

  return (
    <div className="p-4 lg:p-24 flex justify-center">
      <div className="bg-white p-16 lg:min-w-[960px]">
        <GameInfo game={game} />
      </div>
    </div>
  );
}
