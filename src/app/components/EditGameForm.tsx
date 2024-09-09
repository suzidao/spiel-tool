/** @format */
"use client";

import { Fragment, useEffect, useState } from "react";
import { DECISION, NEGOTIATION, ACQUISITION } from "@/types/common";
import { addNewPublisher, addNewDesigner, editGame, addNewGame, assignGame } from "../actions";
import { useGameMetadataContext } from "../contexts";
import AutoCompleteInput from "./AutoCompleteInput";
import { normalizeText } from "@/utils/editData";

export default function EditGameForm(props: { game?: Game; SPIELgame?: SPIELGame }) {
  const { game, SPIELgame } = props;
  const { publishers, designers } = useGameMetadataContext();
  const publisherList = publishers.map((pub) => {
    return { id: pub.publisherid, name: pub.name };
  });
  const designerList = designers.map((des) => {
    return { id: des.designerid, name: des.name };
  });

  const designerNames =
    game && game.designers
      ? game.designers.map((d: Designer) => d.name)
      : SPIELgame && SPIELgame.designers
      ? SPIELgame.designers
      : [];

  const publisherName =
    game && game.publisher ? game.publisher.name : SPIELgame && SPIELgame.publisher ? SPIELgame.publisher : "";

  let existingGame = (SPIELgame ? { ...SPIELgame } : { ...game }) as unknown as GameInput;

  if (!!game) {
    existingGame["publisher"] = game.publisher ? game.publisher!.publisherid : null;
    existingGame["designers"] = game.designers ? game.designers.map((d: Designer) => d.designerid) : [];
  }

  if (!!SPIELgame) {
    existingGame["spielid"] = SPIELgame.spielid;
    existingGame["minplaytime"] = SPIELgame.playtime ? SPIELgame.playtime : undefined;
    existingGame["yearpublished"] = SPIELgame.releasedate ? Number(SPIELgame.releasedate.split("/").pop()) : undefined;
  }

  const initialState =
    !!game || !!SPIELgame
      ? { ...existingGame }
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
  const [formPublisher, setFormPublisher] = useState<string>(publisherName ?? "");
  const [newPublisher, setNewPublisher] = useState<string>("");
  const [formDesigners, setFormDesigners] = useState<string[]>(designerNames ?? [""]);
  const [newDesigners, setNewDesigners] = useState<string[]>([]);

  useEffect(() => {
    let newFormState = { ...formState };
    newFormState["designers"] = designerList
      .filter((designer) => formDesigners.includes(designer.name))
      .map((designer) => designer.id);
    setFormState({ ...formState, ...newFormState });
  }, [formDesigners]);

  useEffect(() => {
    if (!!formState["publisher"]) setNewPublisher("");
  }, [formState]);

  const handleInput = (name: string, value: string, valueId?: number) => {
    let newFormState = { ...formState };
    const fieldName = name;

    switch (fieldName) {
      case "publisher":
        setFormPublisher(value);
        const existingPublisher = publishers.find(
          (pub) => pub.publisherid === valueId || normalizeText(pub.name) === normalizeText(value)
        );
        if (!!existingPublisher) {
          newFormState["publisher"] = existingPublisher.publisherid;
        } else if (!valueId && !!value) {
          newFormState["publisher"] = null;
          setNewPublisher(value);
        }

        setFormState({ ...formState, ...newFormState });
        break;
      case "designers":
        // if designer exists
        const existingDesigner = designers.find(
          (d) => d.designerid === valueId || normalizeText(d.name) === normalizeText(value)
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
    <form onSubmit={handleSubmit}>
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
          <Fragment key={`designer${idx}`}>
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
            min={1}
            name="minplayers"
            defaultValue={formState.minplayers}
            onChange={handleChange}
          />
        </label>
        <label className="flex flex-row items-center gap-2">
          Max:
          <input
            className="w-12"
            type="number"
            min={1}
            name="maxplayers"
            defaultValue={formState.maxplayers}
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
            min={1}
            name="minplaytime"
            defaultValue={formState.minplaytime}
            onChange={handleChange}
          />
        </label>
        <label className="flex flex-row items-center gap-2">
          Max:
          <input
            className="w-12"
            type="number"
            min={1}
            name="maxplaytime"
            defaultValue={formState.maxplaytime}
            onChange={handleChange}
          />
        </label>
      </div>
      <label className="flex flex-row items-center gap-2">
        Age:
        <input
          className="w-12"
          type="number"
          min={1}
          name="minage"
          defaultValue={formState.minage}
          onChange={handleChange}
        />
      </label>
      <label className="flex flex-row items-center gap-2">
        Complexity:
        <input
          className="w-12"
          type="number"
          min={1}
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
      <label className="flex flex-row max-w-96 p-2">
        Decision Status:
        <select onChange={handleChange} name="decision">
          {decisionOptions.map(([key, value]) => (
            <option key={key} value={key}>
              {value}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-row max-w-96 p-2">
        Negotiation Status:
        <select onChange={handleChange} name="negotiation">
          {negotiationOptions.map(([key, value]) => (
            <option key={key} value={key}>
              {value}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-row max-w-96 p-2">
        Acquisition Status:
        <select onChange={handleChange} name="acquisition">
          {acquisitionOptions.map(([key, value]) => (
            <option key={key} value={key}>
              {value}
            </option>
          ))}
        </select>
      </label>
      <button type="submit">{game ? "Edit" : "Add New"} Game</button>
    </form>
  );
}
