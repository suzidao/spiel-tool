/** @format */

import EditGameForm from "@/app/components/EditGameForm";
import Modal from "@/app/components/Modal";

export default async function EditGameModal({ params: { id } }: { params: { id: string } }) {
  const dbGame = await fetch(`http://localhost:3000/api/games/${id}`)
    .then((res) => res.json())
    .catch((error) => console.error(error));

  return (
    <Modal title={dbGame.title}>
      <EditGameForm game={dbGame} />
    </Modal>
  );
}
