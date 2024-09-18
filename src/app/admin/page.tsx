/** @format */
"use client";

import { useEffect, useState } from "react";
import { scrapePreview, getAllGames, addBGGData, scrapeSPIEL, importSPIELData } from "@/app/actions";
import bggData from "@/data/spiel-preview-games.json";
import parentData from "@/data/spiel-preview-parents.json";
import SPIELData from "@/data/spiel-app-games.json";
import Button from "@/app/components/Button";

export default function AdminPage() {
  const [existingBGGgames, setExistingBGGgames] = useState<Game[]>([]);
  const [existingSPIELgames, setExistingSPIELGames] = useState<SPIELGame[]>([]);
  [];

  useEffect(() => {
    getAllGames().then((res) => {
      setExistingBGGgames(res.games.filter((game: Game) => game.previewid !== null));
      setExistingSPIELGames(res.SPIELgames);
    });
  }, []);

  const importedBGGGames = bggData as ImportedBGGData[];
  const metaData = parentData as PublisherMeta[];
  const importedSPIELGames = SPIELData as ImportedSPIELData[];

  const existingBGGPublisherIds = existingBGGgames
    ? [...new Set(existingBGGgames.map((game: Game) => game.publisher.bggid))]
    : [];

  const newBGGPublishers = existingBGGPublisherIds
    ? metaData.filter((pub) => !existingBGGPublisherIds.includes(Number(pub.objectid)))
    : metaData;

  const deletedBGGPublishers = existingBGGPublisherIds
    ? existingBGGPublisherIds.filter((pubid) => !metaData.map((pub) => Number(pub.objectid)).includes(pubid))
    : [];

  const existingPreviewIds = existingBGGgames ? existingBGGgames.map((game: Game) => game.previewid) : [];

  const newBGGgames = existingPreviewIds
    ? importedBGGGames.filter((bggGame: ImportedBGGData) => !existingPreviewIds.includes(Number(bggGame.itemid)))
    : importedBGGGames;

  const deletedBGGGames = existingPreviewIds
    ? existingBGGgames.filter(
        (game: Game) => !importedBGGGames.map((game: ImportedBGGData) => Number(game.itemid)).includes(game.previewid!)
      )
    : [];

  const newSPIELgames = existingSPIELgames
    ? importedSPIELGames.filter(
        (SPIELGame: ImportedSPIELData) =>
          !existingSPIELgames.find(
            (dbSPIELGame: SPIELGame) =>
              dbSPIELGame.title === SPIELGame.TITEL && dbSPIELGame.publisher === SPIELGame.UNTERTITEL
          )
      )
    : importedSPIELGames;

  const deletedSPIELgames = existingSPIELgames
    ? existingSPIELgames.filter(
        (game: SPIELGame) =>
          !importedSPIELGames.find(
            (importedGame: ImportedSPIELData) =>
              importedGame.TITEL === game.title && importedGame.UNTERTITEL === game.publisher
          )
      )
    : [];

  return (
    <div className="flex flex-row p-12 gap-12">
      <div className="flex flex-col gap-4 items-center w-1/2">
        <div className="text-lg">BGG Data</div>
        <div className="flex flex-row gap-4 justify-center">
          <div className="flex flex-col gap-4 items-center justify-center">
            <Button
              btnText="Scrape BGG Preview Items"
              btnColor="orange"
              btnAction={() => scrapePreview(116, "spiel-preview-games.json")}
            />
            <div>
              {newBGGgames.length > 0 && (
                <>
                  <span className="font-bold">{newBGGgames.length}</span>
                  {" | "}
                </>
              )}
              {importedBGGGames.length} || {existingBGGgames.length}
              {deletedBGGGames.length > 0 && (
                <>
                  {" | -"}
                  <span>{deletedBGGGames.length}</span>
                </>
              )}{" "}
              Games
            </div>
          </div>
          <div className="flex flex-col gap-4 items-center justify-center">
            <Button
              btnText="Scrape BGG Parent Items"
              btnColor="orange"
              btnAction={() => scrapePreview(8, "spiel-preview-parents.json", true)}
            />
            <div>
              {newBGGPublishers.length && <span className="font-bold">{newBGGPublishers.length}</span>}
              {" | "}
              {metaData.length} || {existingBGGPublisherIds.length}
              {deletedBGGPublishers.length > 0 && (
                <>
                  {" | -"}
                  <span>{deletedBGGPublishers.length}</span>
                </>
              )}{" "}
              Publishers
            </div>
          </div>
        </div>
        <Button
          btnText="Add New Games"
          btnColor="yellow"
          btnAction={() => addBGGData()}
          disabled={newBGGgames.length === 0}
        />

        {newBGGgames.length > 0 && (
          <table className="mt-4">
            <thead>
              <tr>
                <th>Title</th>
                <th>Publisher</th>
              </tr>
            </thead>
            <tbody>
              {newBGGgames.map((game) => (
                <tr key={game.itemid}>
                  <td className="p-2">{game.geekitem.item.primaryname.name}</td>
                  <td className="p-2">{game.publishers[0].item.primaryname.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div className="flex flex-col gap-4 items-center w-1/2">
        <div className="text-lg">SPIEL Data</div>
        <Button btnColor="orange" btnText="Scrape SPIEL App" btnAction={() => scrapeSPIEL()} />
        <div>
          {newSPIELgames.length > 0 && (
            <>
              <span className="font-bold">{newSPIELgames.length}</span>
              {" | "}
            </>
          )}
          {importedSPIELGames.length} || {existingSPIELgames.length}
          {deletedSPIELgames.length > 0 && (
            <>
              {" | -"}
              <span>{deletedSPIELgames.length}</span>
            </>
          )}{" "}
          Games
        </div>
        <Button
          btnText="Import SPIEL Games"
          btnColor="yellow"
          btnAction={() => importSPIELData()}
          disabled={newSPIELgames.length === 0}
        />
        {newSPIELgames.length > 0 && (
          <table className="mt-4">
            <thead>
              <tr>
                <th>Title</th>
                <th>Publisher</th>
              </tr>
            </thead>
            <tbody>
              {newSPIELgames.map((game: ImportedSPIELData, idx: number) => (
                <tr key={idx + game.TITEL}>
                  <td className="p-2">{game.TITEL}</td>
                  <td className="p-2">{game.UNTERTITEL}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
