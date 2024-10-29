/** @format */

import GameInfo from "@/app/components/GameInfo";
import Modal from "@/app/components/Modal";
import { extendGame } from "@/utils/editData";

export default async function GameModal({ params: { id } }: { params: { id: string } }) {
  const rawdata = await fetch(`http://localhost:3000/api/games/${id}`, {
    method: "GET",
    cache: "no-cache",
  });
  const game = await rawdata.json();

  return (
    <Modal title={game.title}>
      <GameInfo game={game} />
    </Modal>
  );
}
