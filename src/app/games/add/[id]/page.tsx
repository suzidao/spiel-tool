/** @format */

import EditGameForm from "@/app/components/EditGameForm";

export default async function AddSPIELGamePage({ params: { id } }: { params: { id: string } }) {
  const rawdata = await fetch(`http://localhost:3000/api/spielgames/${id}`);
  const { SPIELgame } = await rawdata.json();

  return (
    <div className="p-4 lg:p-24 flex justify-center">
      <div className="bg-white p-16 lg:min-w-[960px]">
        <EditGameForm SPIELgame={SPIELgame} />
      </div>
    </div>
  );
}
