/** @format */

import pubMeta from "../../../../data/spiel-preview-parents.json";
import GameInfo from "@/app/components/GameInfo";
import Modal from "../../../components/Modal";

export default async function GameModal({ params: { id } }: { params: { id: string } }) {
  const rawdata = await fetch(`http://localhost:3000/api/games/${id}`, { cache: "no-store" });
  const data = await rawdata.json();

  const game = data.data.entry;

  return (
    <Modal title={game.version.item.name}>
      <div className="z-10 w-full justify-between font-mono text-sm lg:flex lg:gap-8">
        <div className="">
          <GameInfo game={game} />
        </div>
      </div>
    </Modal>
  );
}
