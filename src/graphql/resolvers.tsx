/** @format */

import gamesData from "../data/spiel-preview-games.json";
import pubMetaData from "../data/spiel-preview-parents.json";

import type Entry from "../types/global.d.ts";
import type PublisherMeta from "../types/global.d.ts";

const games = gamesData as unknown as Entry[];
const pubMeta = pubMetaData as unknown as PublisherMeta[];

const editGame = (game: Entry) => {
  // retrieve and replace location from publisher meta
  const matchingMeta = pubMeta.find((meta) => meta.objectid === game.publishers[0].item.objectid.toString());

  const newLocation = matchingMeta?.location === null || matchingMeta?.location === "" ? "–" : matchingMeta!.location;

  game.location = newLocation;

  // consolidate & format release dates and release overrides
  const releasedate = game.version.item.releasedate;
  const overridedate = game.version.item.overridedate;

  const formattedReleaseDate = () => {
    if (overridedate) {
      return overridedate;
    } else if (releasedate) {
      let splitDate = releasedate.split("-");
      let [year, month, day] = splitDate;

      if (releasedate === "0000-00-00") {
        return "–";
      } else if (releasedate.endsWith("-00-00")) {
        return year;
      } else if (releasedate.endsWith("-00")) {
        return month + "-" + year;
      } else if (splitDate.length > 2 && splitDate[0].length === 4) {
        return month + "-" + day + "-" + year;
      } else {
        return releasedate;
      }
    }
  };
  game.version.item.releasedate = formattedReleaseDate();

  return game;
};

const entries = (): Entry[] => {
  return games.map((game) => {
    return editGame(game);
  });
};

const entry = (args: { id: string }): Entry | undefined => {
  const game = games.find((game) => game.objectid === args.id);
  editGame(game!);
  return game;
};

export const root = {
  entries,
  entry,
};
