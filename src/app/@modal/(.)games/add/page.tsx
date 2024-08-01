/** @format */

import Modal from "@/app/components/Modal";
import NewGameForm from "@/app/components/NewGameForm";

export default function AddGamesModal() {
  return (
    <Modal title="Add New Game">
      <NewGameForm />
    </Modal>
  );
}
