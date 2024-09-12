/** @format */

import ReconcileGameForm from "@/app/components/ReconcileGameForm";
import Modal from "@/app/components/Modal";

export default async function ReconcileGameModal({
  params: { id },
  searchParams: { previewid },
}: {
  params: { id: string };
  searchParams: { previewid: string };
}) {
  const dbGame: DatabaseData = await fetch(`http://localhost:3000/api/games/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  })
    .then((res) => res.json())
    .catch((error) => console.error(error));

  return (
    <Modal title={dbGame.title}>
      <ReconcileGameForm game={dbGame} previewid={previewid} />
    </Modal>
  );
}
