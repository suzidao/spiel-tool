/** @format */

import EditGameForm from "@/app/components/EditGameForm";

export default function AddGamesPage({ searchParams: { previewid } }: { searchParams: { previewid: string } }) {
  return (
    <div className="p-4 lg:p-24 flex justify-center">
      <div className="bg-white p-16 lg:min-w-[960px]">
        <EditGameForm previewid={previewid} />
      </div>
    </div>
  );
}
