/** @format */

import { pool } from "../data/db";
import gamesData from "../data/spiel-preview-games.json";
import pubMetaData from "../data/spiel-preview-parents.json";

import type Entry from "../types/global.d.ts";

const bgg_games = gamesData as unknown as Entry[];
const pubMeta = pubMetaData as unknown as PublisherMeta[];

// Queries

const users = async (): Promise<User[]> => {
  try {
    const result = await pool.query(`SELECT * FROM users`);
    return result.rows;
  } catch (error: any) {
    return error.message;
  }
};

const user = async (args: { id: number }): Promise<User> => {
  try {
    const result = await pool.query(`SELECT * FROM users WHERE userid=${args.id}`);
    return result.rows[0];
  } catch (error: any) {
    return error.message;
  }
};

const games = async (): Promise<Game[]> => {
  try {
    const result = await pool.query(`SELECT * FROM games`);
    return result.rows;
  } catch (error: any) {
    return error.message;
  }
};

// Mutations

const addUser = async (args: { input: UserInput }): Promise<User> => {
  const allUsers = await users().then((users) => users);
  const userid = allUsers.length + 1;

  const { username, password, email } = args.input;
  const user = { userid, ...args.input };

  await pool.query(
    `INSERT INTO users (userid, username, password, email) VALUES (${userid}, '${username}', '${password}', '${email}')`
  );

  return user;
};

// BGG data Query resolvers

const editGameData = (game: Entry) => {
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

// Queries

const entries = (): Entry[] => {
  return bgg_games.map((game) => {
    return editGameData(game);
  });
};

const entry = (args: { id: string }): Entry | undefined => {
  const game = bgg_games.find((game) => game.objectid === args.id);
  editGameData(game!);
  return game;
};

export const root = {
  addUser,
  users,
  user,
  games,
  entries,
  entry,
};
