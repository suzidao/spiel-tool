/** @format */

import gamesData from "../data/spiel-preview-games.json";
import pubMetaData from "../data/spiel-preview-parents.json";

import type Entry from "../types/global.d.ts";
import type PublisherMeta from "../types/global.d.ts";

const games = gamesData as unknown as Entry[];
const pubMeta = pubMetaData as unknown as PublisherMeta[];

const location = (args: { id: string }): PublisherMeta | undefined => {
  return pubMeta.find((meta: PublisherMeta) => (meta.objectid === args.id ? meta : ""));
};

const entries = (): Entry[] => {
  return games;
};
const entry = (args: { id: string }): Entry | undefined => {
  return games.find((game) => game.itemid === args.id);
};

export const root = {
  location,
  entries,
  entry,
};
