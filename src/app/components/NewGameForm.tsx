/** @format */
"use client";

import { useRef, useState } from "react";
import { DECISION, NEGOTIATION, ACQUISITION } from "../../types/common";
import { addNewGame } from "../actions";

export default function NewGameForm() {
  const initialState = {
    title: "",
    publisher: "",
    designers: [""] as string[],
    minplayers: 0,
    maxplayers: 0,
    minplaytime: 0,
    maxplaytime: 0,
    complexity: 0,
    contacts: [{ name: "", email: "" }] as [{ name: string; email: string }],
    decision: "none",
    negotiation: "none",
    acquisition: "none",
    comments: [],
    rankings: [],
    interest: [],
    numhave: 0,
    numneed: 0,
    numpromise: 0,
  };
  const [formState, setFormState] = useState<GameInput>(initialState);
  const ref = useRef<HTMLFormElement>(null);

  const decisionOptions = Object.entries(DECISION);
  const negotiationOptions = Object.entries(NEGOTIATION);
  const acquisitionOptions = Object.entries(ACQUISITION);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, idx?: number) => {
    e.preventDefault();
    let newFormState = { ...formState };
    let fieldName = e.target.name;

    switch (fieldName) {
      case "designers":
        newFormState[fieldName]![idx!] = e.target.value;
        break;
      case "name":
      case "email":
        newFormState["contacts"]![idx!][fieldName] = e.target.value;
        break;
      default:
        newFormState[e.target.name as keyof typeof formState] = e.target.value;
    }

    setFormState({ ...formState, ...newFormState });
  };

  const AddDesigner = (e: any) => {
    e.preventDefault();
    let designers = formState.designers;
    designers!.push("");
    setFormState({ ...formState, designers });
  };

  const RemoveDesigner = (e: any, idx: number) => {
    e.preventDefault();
    let designers = formState.designers;
    designers!.splice(idx, 1);
    setFormState({ ...formState, designers });
  };

  const AddContact = (e: any) => {
    e.preventDefault();
    let contacts = formState.contacts;
    contacts!.push({ name: "", email: "" });
    setFormState({ ...formState, contacts });
  };

  const RemoveContact = (e: any, idx: number) => {
    e.preventDefault();
    let contacts = formState.contacts;
    contacts!.splice(idx, 1);
    setFormState({ ...formState, contacts });
  };

  return (
    <form
      ref={ref}
      onSubmit={async () => {
        await addNewGame(formState);
        setFormState(initialState);
      }}
    >
      <label className="flex flex-col max-w-96 p-2">
        Title:
        <input className="px-2 py-1" type="text" name="title" onChange={handleChange} />
      </label>
      <label className="flex flex-col max-w-96 p-2">
        Publisher:
        <input className="px-2 py-1" type="text" name="publisher" onChange={handleChange} />
      </label>
      <label className="flex flex-col items-start max-w-96 p-2">
        Designer(s): {formState.designers}
        {formState.designers!.map((designer: string, idx: number) => (
          <div key={idx}>
            <input
              className="px-2 py-1"
              type="text"
              value={designer}
              name="designers"
              onChange={(e) => handleChange(e, idx)}
            />
            {idx !== 0 && (
              <button className="place-self-center" onClick={(e) => RemoveDesigner(e, idx)}>
                –
              </button>
            )}
          </div>
        ))}
        <button className="place-self-center" onClick={AddDesigner}>
          +
        </button>
      </label>
      <div className="flex items-center flex-row flex-wrap max-w-96 p-2">
        <div className="mb-3 w-full">Player Count</div>
        <label className="mr-4">
          Min:
          <input
            className="ml-2 w-12 pl-2 py-1"
            type="number"
            name="minplayers"
            placeholder="#"
            onChange={handleChange}
          />
        </label>
        <label className="">
          Max:
          <input
            className="ml-2 w-12 pl-2 py-1"
            type="number"
            name="maxplayers"
            placeholder="#"
            onChange={handleChange}
          />
        </label>
      </div>
      <div className="flex items-center flex-row flex-wrap max-w-96 p-2">
        <div className="mb-3 w-full">Play Time</div>
        <label className="mr-4">
          Min:
          <input
            className="ml-2 w-12 pl-2 py-1"
            type="number"
            name="minplaytime"
            placeholder="#"
            onChange={handleChange}
          />
        </label>
        <label className="mr-4">
          Max:
          <input
            className="ml-2 w-12 pl-2 py-1"
            type="number"
            name="maxplaytime"
            placeholder="#"
            onChange={handleChange}
          />
        </label>
      </div>
      <label className="flex items-center flex-row max-w-96 p-2">
        Complexity:
        <input
          className="ml-2 w-12 px-2 py-1"
          type="text"
          name="complexity"
          placeholder="0.00"
          onChange={handleChange}
        />
      </label>
      <label className="flex flex-row items-center max-w-96 p-2 gap-2">
        Contact:
        {formState.contacts!.map((contact: Contact, idx: number) => (
          <div key={idx}>
            <input
              className="px-2 py-1"
              type="text"
              name="name"
              placeholder="Name"
              value={contact.name}
              onChange={(e) => handleChange(e, idx)}
            />
            <input
              className="px-2 py-1"
              type="text"
              name="email"
              placeholder="Email"
              value={contact.email}
              onChange={(e) => handleChange(e, idx)}
            />
            {idx !== 0 && (
              <button className="place-self-center" onClick={(e) => RemoveContact(e, idx)}>
                –
              </button>
            )}
          </div>
        ))}
        <button className="place-self-center" onClick={AddContact}>
          +
        </button>
      </label>
      <div>
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
      </div>
      <button type="submit">Add New Game</button>
    </form>
  );
}
