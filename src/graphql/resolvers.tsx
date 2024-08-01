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

const game = async (args: { id: number }): Promise<Game> => {
  try {
    const result = await pool.query(`SELECT * FROM games WHERE gameid=${args.id}`);
    return result.rows[0];
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

const addBGGGames = async (): Promise<Game[]> => {
  const allGames = await games().then((games) => games);
  const lastGameId = allGames.length > 0 ? allGames[allGames.length - 1].gameid : 0;
  const allItemIds = allGames.length > 0 ? allGames.map((game: Game) => game.itemid !== null) : [];
  const lastItemId = allGames.length > 0 ? allItemIds[allItemIds.length - 1] : 0;

  const newGames = bgg_games.filter((game: Entry) => Number(game.itemid) > Number(lastItemId!));

  if (newGames) {
    for (let i = 0; i < newGames.length; i++) {
      await pool.query(`INSERT INTO games (gameid, itemid) VALUES (${lastGameId + 1 + i}, ${newGames[i].itemid})`);
    }
  }

  return allGames;
};

const addGame = async (args: { input: GameInput }): Promise<Game> => {
  const allGames = await games().then((games) => games);
  const gameid = allGames.length + 1;

  const {
    title,
    publisher,
    designers,
    minplayers,
    maxplayers,
    minplaytime,
    maxplaytime,
    complexity,
    contacts,
    decision,
    negotiation,
    acquisition,
    comments,
    rankings,
    interest,
    numhave,
    numneed,
    numpromise,
  } = args.input;

  const game = { gameid, ...args.input };
  const query = `INSERT INTO games (
      gameid,
      title,
      publisher,
      designers,
      minplayers,
      maxplayers,
      minplaytime,
      maxplaytime,
      complexity,
      decision,
      negotiation,
      acquisition,
      comments,
      rankings,
      numhave,
      numneed,
      numpromise,
      interest,
      contacts
    ) VALUES (
      ${gameid},
      '${title}',
      '${publisher}',
      '{${designers}}',
      ${minplayers},
      ${maxplayers},
      ${minplaytime},
      ${maxplaytime},
      ${complexity},
      '${decision}',
      '${negotiation}',
      '${acquisition}',
      '{${comments}}',
      '{${rankings}}',
      ${numhave},
      ${numneed},
      ${numpromise},
      '{${interest}}',
      '${contacts}'
    )`;

  await pool
    .query(query)
    .then((res) => console.log(`Added ${res.rows[0].title} to database`))
    .catch((error) => console.error(error));

  return game;
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
  addBGGGames,
  addGame,
  games,
  game,
  entries,
  entry,
};
