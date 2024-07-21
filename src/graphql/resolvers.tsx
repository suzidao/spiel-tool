/** @format */

import gamesData from "../data/spiel-preview-games.json";
import pubMetaData from "../data/spiel-preview-parents.json";

import type Entry from "../types/global.d.ts";
import type PublisherMeta from "../types/global.d.ts";

const games = gamesData as unknown as Entry[];
const pubMeta = pubMetaData as unknown as PublisherMeta[];

// const location = (args: { id: string }): PublisherMeta | undefined => {
//   return pubMeta.find((meta: PublisherMeta) => (meta.objectid === args.id ? meta : ""));
// };

const entries = (): Entry[] => {
  const editedLocations = games.map((game) => {
    const newLocation = pubMeta.map((meta) => {
      return meta.objectid === game.publishers[0].item.objectid ? meta.location : game.location;
    })[0];
    game.location = newLocation;
    return game;
  });
  return editedLocations;
};
const entry = (args: { id: string }): Entry | undefined => {
  return games.find((game) => game.objectid === args.id);
};

export const root = {
  entries,
  entry,
};
