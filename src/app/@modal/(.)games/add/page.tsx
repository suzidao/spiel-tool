/** @format */

import Modal from "@/app/components/Modal";
import EditGameForm from "@/app/components/EditGameForm";

export default function AddGamesModal({ searchParams: { previewid } }: { searchParams: { previewid: string } }) {
  return (
    <Modal title="Add New Game">
      <EditGameForm previewid={previewid} />
    </Modal>
  );
}
