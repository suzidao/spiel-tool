/** @format */

import GameInfo from "@/app/components/GameInfo";
import Modal from "../../../components/Modal";

export default async function GameModal({ params: { id } }: { params: { id: string } }) {
  const rawdata = await fetch(`http://localhost:3000/api/games/${id}`);
  const { data } = await rawdata.json();

  const game = data.entry;

  return (
    <Modal title={game.version.item.name}>
      <GameInfo game={game} />
    </Modal>
  );
}
