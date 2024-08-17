/** @format */
"use client";

import { useEffect, useState } from "react";
import { DECISION, NEGOTIATION, ACQUISITION } from "@/types/common";
import { addNewPublisher, addNewDesigner, editGame } from "../actions";
import { useGameMetadataContext } from "../contexts";
import AutoCompleteInput from "./AutoCompleteInput";
import { normalizeText } from "@/utils/editData";

export default function EditGameForm(props: { game: Game }) {
  const { publishers, designers } = useGameMetadataContext();
  const publisherList = publishers.map((pub) => {
    return { id: pub.publisherid, name: pub.name };
  });
  const designerList = designers.map((des) => {
    return { id: des.designerid, name: des.name };
  });
  const game = { ...props.game };

  const initialState = {
    gameid: game.gameid,
    bggid: game.bggid,
    title: game.title,
    publisher: game.publisher.publisherid,
    designers: game.designers.map((d) => d.designerid),
    minplayers: game.minplayers,
    maxplayers: game.maxplayers,
    minplaytime: game.minplaytime,
    maxplaytime: game.maxplaytime,
    complexity: game.complexity,
    minage: game.minage,
    location: game.location,
    yearpublished: game.yearpublished,
    decision: game.decision,
    negotiation: game.negotiation,
    acquisition: game.acquisition,
    numneed: game.numneed,
    numhave: game.numhave,
    numpromise: game.numpromise,
  };

  const decisionOptions = Object.entries(DECISION);
  const negotiationOptions = Object.entries(NEGOTIATION);
  const acquisitionOptions = Object.entries(ACQUISITION);

  const [formState, setFormState] = useState<GameInput>(initialState);
  const [newPublisher, setNewPublisher] = useState<string>("");
  const [formDesigners, setFormDesigners] = useState<string[]>(game.designers.map((d) => d.name));
  const [newDesigners, setNewDesigners] = useState<string[]>([]);

  const handleInput = (name: string, value: string, valueId?: number) => {
    let newFormState = { ...formState };
    const fieldName = name;

    switch (fieldName) {
      case "publisher":
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

        if (matchingIds.length !== formDesigners.length && !existingDesigner) {
          let unknownDesigners = fieldValues.filter(
            (fieldValue) =>
              !designerList.map((d) => normalizeText(d.name)).includes(normalizeText(fieldValue)) && !!fieldValue
          );
          setNewDesigners(unknownDesigners);
        } else {
          setNewDesigners([]);
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

    await editGame(game.gameid, formState);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Title:
        <input type="text" name="title" defaultValue={formState.title} onChange={handleChange} />
      </label>
      <label>
        Publisher:
        <AutoCompleteInput
          name="publisher"
          dataList={publisherList}
          value={game.publisher.name}
          onSelect={handleInput}
        />
      </label>
      <label>
        Designer(s):
        {formDesigners.length ? (
          formDesigners.map((designer, idx) => (
            <AutoCompleteInput
              key={`designer${idx}`}
              name="designers"
              dataList={designerList}
              value={designer}
              onSelect={handleInput}
            />
          ))
        ) : (
          <AutoCompleteInput name="designers" dataList={designerList} value="" onSelect={handleInput} />
        )}
      </label>
      <label>
        Min:
        <input type="number" name="minplayers" defaultValue={formState.minplayers} onChange={handleChange} />
      </label>
      <label>
        Max:
        <input type="number" name="maxplayers" defaultValue={formState.maxplayers} onChange={handleChange} />
      </label>
      <label>
        Min:
        <input type="number" name="minplaytime" defaultValue={formState.minplaytime} onChange={handleChange} />
      </label>
      <label>
        Max:
        <input type="number" name="maxplaytime" defaultValue={formState.maxplaytime} onChange={handleChange} />
      </label>
      <label>
        Age:
        <input type="number" name="minage" defaultValue={formState.minage} onChange={handleChange} />
      </label>
      <label>
        Complexity:
        <input type="number" name="complexity" defaultValue={formState.complexity} onChange={handleChange} />
      </label>
      <label>
        Location:
        <input type="text" name="location" defaultValue={formState.location} onChange={handleChange} />
      </label>
      <label>
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
      <button type="submit">Edit Game</button>
    </form>
  );
}
