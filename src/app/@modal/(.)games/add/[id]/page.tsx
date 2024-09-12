/** @format */

import Modal from "@/app/components/Modal";
import EditGameForm from "@/app/components/EditGameForm";

export default async function AddSPIELGameModal({ params: { id } }: { params: { id: string } }) {
  const SPIELgame = await fetch(`http://localhost:3000/api/spielgames/${id}`)
    .then((res) => res.json())
    .then((data) => data.SPIELgame);

  return (
    <Modal title="Add New Game">
      <EditGameForm SPIELgame={SPIELgame} />
    </Modal>
  );
}
