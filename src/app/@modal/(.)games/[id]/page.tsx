/** @format */

import GameInfo from "@/app/components/GameInfo";
import Modal from "../../../components/Modal";

export default async function GameModal({ params: { id } }: { params: { id: string } }) {
  const rawdata = await fetch(`http://localhost:3000/api/games/${id}`);
  const game = await rawdata.json();

  return (
    <Modal title={game.title}>
      <GameInfo game={game} />
    </Modal>
  );
}
