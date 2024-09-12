/** @format */

import EditGameForm from "@/app/components/EditGameForm";

export default async function EditGamePage({ params: { id } }: { params: { id: string } }) {
  const game = await fetch(`http://localhost:3000/api/games/${id}`)
    .then((res) => res.json())
    .catch((error) => console.error(error));

  return (
    <div className="p-4 lg:p-24 flex justify-center">
      <div className="bg-white p-16 lg:min-w-[960px]">
        <EditGameForm game={game} />
      </div>
    </div>
  );
}
