/** @format */

import EditGameForm from "@/app/components/EditGameForm";

export default function AddGamesPage() {
  return (
    <div className="p-4 lg:p-24 flex justify-center">
      <div className="bg-white p-16 lg:min-w-[960px]">
        <EditGameForm />
      </div>
    </div>
  );
}
