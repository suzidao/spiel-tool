/** @format */

import Modal from "@/app/components/Modal";
import EditGameForm from "@/app/components/EditGameForm";

export default function AddGamesModal() {
  return (
    <Modal title="Add New Game">
      <EditGameForm />
    </Modal>
  );
}
