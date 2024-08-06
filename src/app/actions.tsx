/** @format */

"use server";

import * as fs from "fs";
import * as path from "path";
import bggData from "../data/spiel-preview-games.json";

export async function addNewUser(formData: FormData) {
  await fetch("http://localhost:3000/api/users/add", {
    method: "POST",
    body: formData,
  }).then((response) => {
    return response.json();
  });
}

export async function scrapePreview(pageCount: number, filename: string, parent?: boolean) {
  const previewItems: ImportedData[] = [];
  for (let i = 1; i <= pageCount; i++) {
    const url = `https://api.geekdo.com/api/geekpreview${
      !!parent ? "parent" : ""
    }items?nosession=1&pageid=${i}&previewid=68`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
      cache: "no-store",
    });
    const batchItems = await response.json();
    for (let i = 0; i < batchItems.length; i++) {
      previewItems.push(batchItems[i]);
    }
  }
  const data = JSON.stringify(previewItems);

  fs.writeFile(path.join(process.cwd(), "src/data", filename), data, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("SUCCESS!!");
    }
  });
}

export async function getNewGames() {
  const rawdata = await fetch("http://localhost:4000/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify({
      query: `
        query {
          games {
            previewid
          }
        }
      `,
    }),
  });

  const { data } = await rawdata.json();
  const dbGames = data ? data.games : [];

  const bggGames = bggData as ImportedData[];
  const gameIdList = dbGames ? dbGames.filter((dbGame: Game) => dbGame.previewid !== null && dbGame.previewid) : [];

  const newGames = bggGames.filter((bggGame: ImportedData) => {
    return gameIdList.length === 0 ? bggGame : Number(bggGame.itemid) > gameIdList[gameIdList.length - 1].previewid;
  });

  return newGames.map((game) => game.itemid);
}

export async function addBGGData() {
  // all the action happens in the resolver because we need dbGames
  const rawdata = await fetch("http://localhost:4000/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
        mutation {
          addBGGData { gameid }
        }
      `,
    }),
  });
  const data = await rawdata.json();

  return data;
}

export async function addNewGame(formState: GameInput) {
  await fetch("http://localhost:3000/api/games/add", {
    method: "POST",
    body: JSON.stringify(formState),
  }).then((response) => {
    return response.json();
  });
}
