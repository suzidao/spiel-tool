/** @format */
"use client";

import { useState } from "react";
import { useGameMetadataContext } from "@/app/contexts";
import { editDesigner, editGame, editPublisher } from "@/app/actions";
import { formatBGGGame, formatPlayerCount, formatPlayTime, normalizeText } from "@/utils/editData";
import Button from "@/app/components/Button";
import BGGData from "@/data/spiel-preview-games.json";

export default function ReconcileGameForm(props: { game: DatabaseData; previewid: string }) {
  const { game, previewid } = props;
  const [reconciledGame, setReconciledGame] = useState<DatabaseData>(game);
  const { publishers, designers } = useGameMetadataContext();

  const importedGames = BGGData as ImportedBGGData[];

  const bggGame = importedGames.find((game: ImportedBGGData) => game.itemid === previewid);

  const bggPublisher = {
    name: bggGame!.publishers[0].item.primaryname.name,
    bggid: bggGame!.publishers[0].item.objectid,
  };

  const bggDesigners = bggGame!.geekitem.item.links.boardgamedesigner.map((d: GameMeta) => {
    return { name: d.name, bggid: d.objectid };
  });

  const gamePublisher = game.publisher;

  const gameDesigners = game.designers;

  const formattedBGGgame = {
    ...formatBGGGame(bggGame!),
    publisher: bggPublisher,
    designers: bggDesigners,
  } as unknown as DatabaseData;

  let tempGame = { ...reconciledGame, bggid: Number(bggGame!.objectid), previewid: Number(previewid) };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fieldName = e.target.name.split("_")[1];
    const fieldValue = e.target.value.split("").pop();

    switch (fieldName) {
      case "playercount":
        tempGame["minplayers"] = fieldValue === "0" ? game["minplayers"] : formattedBGGgame["minplayers"];
        tempGame["maxplayers"] = fieldValue === "0" ? game["maxplayers"] : formattedBGGgame["maxplayers"];
        break;
      case "playtime":
        tempGame["minplaytime"] = fieldValue === "0" ? game["minplaytime"] : formattedBGGgame["minplaytime"];
        tempGame["maxplaytime"] = fieldValue === "0" ? game["maxplaytime"] : formattedBGGgame["maxplaytime"];
        break;
      default:
        let property: keyof DatabaseData;

        for (property in tempGame) {
          if (property === fieldName) {
            tempGame[property]<any> = fieldValue === "0" ? game[property] : formattedBGGgame[property];
          }
        }
    }

    setReconciledGame(tempGame);
  };

  const handleEdit = async () => {
    if (!gamePublisher!.bggid && bggPublisher) {
      const publisherInput = {
        bggid: bggPublisher.bggid,
        name: reconciledGame["publisher"].name,
      };

      await editPublisher(gamePublisher!.publisherid, publisherInput);
    }

    if (gameDesigners && bggDesigners) {
      for (let i = 0; i < gameDesigners.length; i++) {
        const bggDesigner = bggDesigners.find((d) => normalizeText(d.name) === normalizeText(gameDesigners[i].name));

        if (!gameDesigners[i].bggid && bggDesigner) {
          const chosenDesigner =
            reconciledGame["designers"].find((d) => normalizeText(d.name) === normalizeText(bggDesigner.name)) ?? null;

          if (chosenDesigner) {
            const designerInput = {
              bggid: Number(bggDesigner.bggid),
              name: chosenDesigner.name,
            };

            await editDesigner(gameDesigners[i].designerid, designerInput);
          }
        }
      }
    }

    let reconciledInput = { ...reconciledGame } as unknown as GameInput;
    reconciledInput["publisher"] = gamePublisher!.publisherid;
    reconciledInput["designers"] = gameDesigners.map((d) => d.designerid);

    await editGame(game.gameid, reconciledInput);

    history.back();
  };

  return (
    <>
      <div className="flex flex-row gap-4">
        <div className="flex flex-col items-end gap-2">
          <div>&nbsp;</div>
          <div>Title:</div>
          <div>Publisher:</div>
          <div>Designers:</div>
          <div>Player Count:</div>
          <div>Play Time:</div>
          <div>Age:</div>
          <div>Complexity:</div>
          <div>Location:</div>
          <div>Year Published:</div>
        </div>

        {[game, formattedBGGgame].map((game, idx) => {
          const {
            title,
            publisher,
            designers,
            location,
            minplayers,
            maxplayers,
            minplaytime,
            maxplaytime,
            yearpublished,
            minage,
            complexity,
          } = game;

          return (
            <div key={`dataset${idx}`} className="flex flex-col gap-2">
              <div className="font-semibold">{idx === 0 ? "Database Data" : "BGG Data"}</div>
              <label className="flex gap-2">
                <input
                  onChange={(e) => handleChange(e)}
                  type="radio"
                  name="choose_title"
                  defaultChecked={idx === 0}
                  value={`title${idx}`}
                />
                {title}
              </label>
              <label className="flex gap-2">
                <input
                  onChange={(e) => handleChange(e)}
                  type="radio"
                  name="choose_publisher"
                  defaultChecked={idx === 0}
                  value={`publisher${idx}`}
                />
                {publisher.name}
              </label>
              <label className="flex gap-2">
                <input
                  onChange={(e) => handleChange(e)}
                  type="radio"
                  name="choose_designers"
                  defaultChecked={idx === 0}
                  value={`designers${idx}`}
                />
                {designers.map((d, idx) => {
                  return d.name + (idx !== designers.length - 1 ? ", " : "");
                })}
              </label>
              <label className="flex gap-2">
                <input
                  onChange={(e) => handleChange(e)}
                  type="radio"
                  name="choose_playercount"
                  defaultChecked={idx === 0}
                  value={`playercount${idx}`}
                />
                {formatPlayerCount(minplayers, maxplayers)}
              </label>
              <label className="flex gap-2">
                <input
                  onChange={(e) => handleChange(e)}
                  type="radio"
                  name="choose_playtime"
                  defaultChecked={idx === 0}
                  value={`playtime${idx}`}
                />
                {formatPlayTime(minplaytime, maxplaytime)} minutes
              </label>
              <label className="flex gap-2">
                <input
                  onChange={(e) => handleChange(e)}
                  type="radio"
                  name="choose_minage"
                  defaultChecked={idx === 0}
                  value={`minage${idx}`}
                />
                {minage ? minage + "+" : "—"}
              </label>
              <label className="flex gap-2">
                <input
                  onChange={(e) => handleChange(e)}
                  type="radio"
                  name="choose_complexity"
                  defaultChecked={idx === 0}
                  value={`complexity${idx}`}
                />
                {complexity ?? "—"}
              </label>
              <label className="flex gap-2">
                <input
                  onChange={(e) => handleChange(e)}
                  type="radio"
                  name="choose_location"
                  defaultChecked={idx === 0}
                  value={`location${idx}`}
                />
                {location ?? "—"}
              </label>
              <label className="flex gap-2">
                <input
                  onChange={(e) => handleChange(e)}
                  type="radio"
                  name="choose_yearpublished"
                  defaultChecked={idx === 0}
                  value={`yearpublished${idx}`}
                />
                {yearpublished ?? "—"}
              </label>
            </div>
          );
        })}
      </div>
      <div className="flex flex-row gap-2 justify-center pt-6 pb-2">
        <Button btnColor="gray" btnText="Cancel" btnAction={() => history.back()} />
        <Button btnColor="green" btnText="Edit Game" btnAction={() => handleEdit()} />
      </div>
    </>
  );
}
