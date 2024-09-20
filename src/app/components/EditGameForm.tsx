/** @format */
"use client";

import { Fragment, useEffect, useState } from "react";
import { DECISION, NEGOTIATION, ACQUISITION } from "@/types/common";
import { addNewPublisher, addNewDesigner, editGame, addNewGame } from "@/app/actions";
import { useGameMetadataContext } from "@/app/contexts";
import { formatBGGGame, normalizeText } from "@/utils/editData";
import AutoCompleteInput from "@/app/components/AutoCompleteInput";
import Button from "@/app/components/Button";
import bggData from "@/data/spiel-preview-games.json";

export default function EditGameForm(props: { game?: Game; SPIELgame?: SPIELGame; previewid?: string }) {
  const { game, SPIELgame, previewid } = props;
  const { publishers, designers } = useGameMetadataContext();

  const bggGames = bggData as ImportedBGGData[];
  const bggGame = bggGames.find((game) => game.itemid === previewid);

  const designerNames = () => {
    if (game && game.designers) {
      return game.designers.map((d: Designer) => d.name);
    } else if (SPIELgame && SPIELgame.designers) {
      return SPIELgame.designers;
    } else if (bggGame && bggGame.geekitem.item.links.boardgamedesigner.length > 0) {
      return bggGame.geekitem.item.links.boardgamedesigner.map((d) => d.name);
    } else {
      return [];
    }
  };

  const publisherName = () => {
    if (game && game.publisher) {
      return game.publisher.name;
    } else if (SPIELgame && SPIELgame.publisher) {
      return SPIELgame.publisher;
    } else if (bggGame && bggGame.publishers.length > 0) {
      return bggGame.publishers[0].item.primaryname.name;
    } else {
      return "";
    }
  };

  let existingGame = (SPIELgame
    ? {
        ...SPIELgame,
        spielid: SPIELgame.spielid,
        minplaytime: SPIELgame.playtime ?? undefined,
        yearpublished: SPIELgame.releasedate ? Number(SPIELgame.releasedate.split("/").pop()) : undefined,
      }
    : {
        ...game,
        publisher: game?.publisher.publisherid,
        designers: game?.designers.map((d) => d.designerid),
      }) as unknown as GameInput;

  const initialState =
    !!game || !!SPIELgame
      ? { ...existingGame }
      : !!bggGame
      ? formatBGGGame(bggGame)
      : {
          bggid: undefined,
          title: "",
          publisher: null,
          designers: [],
          minplayers: undefined,
          maxplayers: undefined,
          minplaytime: undefined,
          maxplaytime: undefined,
          complexity: undefined,
          minage: undefined,
          location: undefined,
          yearpublished: undefined,
          decision: "none",
          negotiation: "none",
          acquisition: "none",
          numhave: 0,
          numneed: undefined,
          numpromise: undefined,
        };

  const decisionOptions = Object.entries(DECISION);
  const negotiationOptions = Object.entries(NEGOTIATION);
  const acquisitionOptions = Object.entries(ACQUISITION);

  const [formState, setFormState] = useState<GameInput>(initialState);
  const [formPublisher, setFormPublisher] = useState<string>(publisherName() ?? "");
  const [newPublisher, setNewPublisher] = useState<string>("");
  const [formDesigners, setFormDesigners] = useState<string[]>(designerNames() ?? [""]);
  const [newDesigners, setNewDesigners] = useState<string[]>([]);

  const publisherList = publishers.map((pub) => {
    return { id: pub.publisherid, name: pub.name };
  });

  const designerList = designers.map((des) => {
    return { id: des.designerid, name: des.name };
  });

  useEffect(() => {
    let newFormState = { ...formState };
    // prevent from firing until Context loads
    if (designerList.length) {
      newFormState["designers"] = designerList
        .filter((designer) => formDesigners.includes(designer.name))
        .map((designer) => designer.id);
      setFormState({ ...formState, ...newFormState });
    }
  }, [formDesigners]);

  useEffect(() => {
    if (!!formState["publisher"]) setNewPublisher("");
    if (formState["designers"].length > 0) setNewDesigners([]);
  }, [formState]);

  const handleInput = (name: string, value: string, valueId?: number) => {
    let newFormState = { ...formState };
    const fieldName = name;

    // prevent from firing until Context loads
    if (publisherList.length && designerList.length) {
      switch (fieldName) {
        case "publisher":
          setFormPublisher(value);
          const existingPublisher = publisherList.find(
            (pub) => pub.id === valueId || normalizeText(pub.name) === normalizeText(value)
          );
          if (!!existingPublisher) {
            newFormState["publisher"] = existingPublisher.id;
          } else if (!valueId && !!value) {
            newFormState["publisher"] = null;
            setNewPublisher(value);
          }

          setFormState({ ...formState, ...newFormState });
          break;
        case "designers":
          // if designer exists
          const existingDesigner = designerList.find(
            (d) => d.id === valueId || normalizeText(d.name) === normalizeText(value)
          );

          // get names from fields
          const fields = Array.from(document.getElementsByName("designers")) as HTMLInputElement[];
          let fieldValues = fields.map((input) => input.value);
          setFormDesigners(fieldValues);

          const matchingIds = designerList
            .filter((d) => fieldValues.map((value) => normalizeText(value)).includes(normalizeText(d.name)))
            .map((d) => d.id);

          newFormState["designers"] = matchingIds;

          if (matchingIds.length === formDesigners.length && existingDesigner) {
            setNewDesigners([]);
          } else {
            let unknownDesigners = fieldValues.filter(
              (fieldValue) =>
                !designerList.map((d) => normalizeText(d.name)).includes(normalizeText(fieldValue)) && !!fieldValue
            );
            setNewDesigners(unknownDesigners);
          }

          setFormState({ ...formState, ...newFormState });
          break;
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.preventDefault();
    let newFormState = { ...formState };
    const fieldName = e.target.name;
    const fieldType = e.target.type;

    switch (fieldType) {
      case "text":
        newFormState[fieldName as keyof typeof formState] = e.target.value;
        break;
      case "number":
        newFormState[fieldName as keyof typeof formState] = Number(e.target.value);
        break;
    }

    setFormState({ ...formState, ...newFormState });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!!newPublisher) {
      await addNewPublisher(newPublisher).then((res) => (formState["publisher"] = res!));
    }

    if (newDesigners.length > 0) {
      for (let i = 0; i < newDesigners.length; i++) {
        if (!designers.map((d) => d.name).includes(newDesigners[i]))
          await addNewDesigner(newDesigners[i]).then((res) => formState["designers"].push(res!));
      }
    }

    game ? await editGame(game.gameid!, formState) : await addNewGame(formState);

    history.back();
  };

  const AddDesigner = (e: any) => {
    e.preventDefault();
    setFormDesigners([...formDesigners, ""]);
  };

  const RemoveDesigner = (e: any, idx: number) => {
    e.preventDefault();
    let designers = [...formDesigners];
    designers.splice(idx, 1);
    setFormDesigners(designers);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <label className="flex flex-row items-center gap-2">
        Title:
        <input type="text" name="title" defaultValue={formState.title} onChange={handleChange} />
      </label>
      <label className="flex flex-row items-center gap-2">
        Publisher:
        <AutoCompleteInput name="publisher" dataList={publisherList} value={formPublisher} onSelect={handleInput} />
      </label>
      <label className="flex flex-row items-center gap-2">
        Designer(s):
        {formDesigners.map((designer, idx) => (
          <Fragment key={`game${game?.gameid}designer${idx}`}>
            <AutoCompleteInput name="designers" dataList={designerList} value={designer} onSelect={handleInput} />
            {formDesigners.length > 1 && <button onClick={(e) => RemoveDesigner(e, idx)}> – </button>}
          </Fragment>
        ))}
        <button onClick={AddDesigner}> + </button>
      </label>
      <div className="flex flex-row gap-2 items-center">
        Player Count:
        <label className="flex flex-row items-center gap-2">
          Min:
          <input
            className="w-12"
            type="number"
            name="minplayers"
            defaultValue={formState.minplayers ?? undefined}
            onChange={handleChange}
          />
        </label>
        <label className="flex flex-row items-center gap-2">
          Max:
          <input
            className="w-12"
            type="number"
            name="maxplayers"
            defaultValue={formState.maxplayers ?? undefined}
            onChange={handleChange}
          />
        </label>
      </div>
      <div className="flex flex-row gap-2 items-center">
        Play Time:
        <label className="flex flex-row items-center gap-2">
          Min:
          <input
            className="w-12"
            type="number"
            name="minplaytime"
            defaultValue={formState.minplaytime ?? undefined}
            onChange={handleChange}
          />
        </label>
        <label className="flex flex-row items-center gap-2">
          Max:
          <input
            className="w-12"
            type="number"
            name="maxplaytime"
            defaultValue={formState.maxplaytime ?? undefined}
            onChange={handleChange}
          />
        </label>
      </div>
      <label className="flex flex-row items-center gap-2">
        Age:
        <input className="w-12" type="number" name="minage" defaultValue={formState.minage} onChange={handleChange} />
      </label>
      <label className="flex flex-row items-center gap-2">
        Complexity:
        <input
          className="w-14"
          type="number"
          step={0.01}
          name="complexity"
          defaultValue={formState.complexity}
          onChange={handleChange}
        />
      </label>
      <label className="flex flex-row items-center gap-2">
        Location:
        <input type="text" name="location" defaultValue={formState.location} onChange={handleChange} />
      </label>
      <label className="flex flex-row items-center gap-2">
        Year Published:
        <input type="number" name="yearpublished" defaultValue={formState.yearpublished} onChange={handleChange} />
      </label>
      <label className="flex flex-row items-center max-w-96 gap-2">
        Decision Status:
        <select
          className="border border-gray-400 bg-white py-0.5 rounded"
          onChange={handleChange}
          defaultValue={formState.decision}
          name="decision"
        >
          {decisionOptions.map(([key, value]) => (
            <option key={key} value={key}>
              {value}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-row items-center max-w-96 gap-2">
        Negotiation Status:
        <select
          className="border border-gray-400 bg-white py-0.5 rounded"
          onChange={handleChange}
          defaultValue={formState.negotiation}
          name="negotiation"
        >
          {negotiationOptions.map(([key, value]) => (
            <option key={key} value={key}>
              {value}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-row items-center max-w-96 gap-2">
        Acquisition Status:
        <select
          className="border border-gray-400 bg-white py-0.5 rounded"
          onChange={handleChange}
          defaultValue={formState.acquisition}
          name="acquisition"
        >
          {acquisitionOptions.map(([key, value]) => (
            <option key={key} value={key}>
              {value}
            </option>
          ))}
        </select>
      </label>
      <Button
        className="self-center"
        btnColor="green"
        btnText={(game ? "Save" : "Add New") + " Game"}
        btnType="submit"
      />
    </form>
  );
}
