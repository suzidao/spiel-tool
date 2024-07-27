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
  const previewItems: Entry[] = [];

  for (let i = 1; i <= pageCount; i++) {
    const response = await fetch(
      `https://api.geekdo.com/api/geekpreview${!!parent && "parent"}items?nosession=1&pageid=${i}&previewid=68`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        },
        cache: "no-store",
      }
    );
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

export async function getItemIds() {
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
            itemid
          }
        }
      `,
    }),
  });

  const { data } = await rawdata.json();
  const games = data.games;
  const gamesData = bggData as Entry[];

  const newGames = gamesData.filter((game: Entry) => {
    return Number(game.itemid) > games[games.length - 1].itemid;
  });

  return newGames.map((game) => game.itemid);
}
