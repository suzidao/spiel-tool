/** @format */

"use server";

import * as fs from "fs";
import * as path from "path";
import bggData from "../data/spiel-preview-games.json";
import SPIELData from "../data/spiel-app-games.json";

export async function addNewUser(formData: FormData) {
  await fetch("http://localhost:3000/api/users/add", {
    method: "POST",
    body: formData,
  }).then((res) => res.json());
}

export async function addNewPublisher(name: string) {
  let newPubID;
  await fetch("http://localhost:3000/api/publishers/add", {
    method: "POST",
    body: JSON.stringify(name),
  })
    .then((res) => res.json().then((data) => (newPubID = data.addPublisher.publisherid)))
    .catch((error) => console.error(error));

  return newPubID;
}

export async function addNewDesigner(name: string) {
  let newDesignerID;
  await fetch("http://localhost:3000/api/designers/add", {
    method: "POST",
    body: JSON.stringify(name),
  })
    .then((res) => res.json().then((data) => (newDesignerID = data.addDesigner.designerid)))
    .catch((error) => console.error(error));
  return newDesignerID;
}

export async function assignGame(spielid: number, gameid: number) {
  await fetch("http://localhost:4000/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
    body: JSON.stringify({
      query: `
        mutation ($spielid: Int, $gameid: Int) {
          assignGame (spielid: $spielid, gameid: $gameid) { spielid }
        }
      `,
      variables: { spielid: spielid, gameid: gameid },
    }),
  })
    .then((res) => res.json().then((data) => data))
    .catch((error) => console.error(error));
}

export async function toggleIgnore(spielid: number, ignore: boolean) {
  await fetch("http://localhost:4000/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
    body: JSON.stringify({
      query: `
        mutation ($spielid: Int, $ignore: Boolean) {
          toggleIgnore (spielid: $spielid, ignore: $ignore) { spielid }
        }
      `,
      variables: { spielid: spielid, ignore: ignore },
    }),
  })
    .then((res) => res.json().then((data) => data))
    .catch((error) => console.error(error));
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
      console.error(err);
    } else {
      console.log("Scraped BGG!!");
    }
  });
}

export async function scrapeSPIEL() {
  const response = await fetch(
    "https://maps.eyeled-services.de/en/spiel24/products?columns=%5B%22INFO%22%2C%22S_ORDER%22%2C%22TITEL%22%2C%22FIRMA_ID%22%2C%22UNTERTITEL%22%2C%22BILDER%22%2C%22BILDER_VERSIONEN%22%2C%22BILDER_TEXTE%22%5D",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
      cache: "no-store",
    }
  );

  const data = await response.json().then((result) => JSON.stringify(result.products));

  fs.writeFile(path.join(process.cwd(), "src/data", "spiel-app-games.json"), data, (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log("Scraped SPIEL App!!");
    }
  });
}

export async function getGames() {
  return await fetch("http://localhost:3000/api/games", { cache: "no-store" }).then((data) => data.json());
}

export async function getAllGames() {
  const rawData = await fetch("http://localhost:4000/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
    cache: "no-store",
    body: JSON.stringify({
      query: `
        query getAllGames {
          SPIELgames {
            spielid
            gameid
            title
            publisher
            designers
            price
            releasedate
            minplayers
            maxplayers
            playtime
            complexity
            minage
            location
            mechanics
            categories
            ignore
            subtypes
          }
          games {
            gameid
            title
            publisher {
              name
            }
          }
        }
      `,
    }),
  });
  const { data } = await rawData
    .json()
    .then((res) => res)
    .catch((error) => console.error(error));

  return data;
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
          SPIELgames {
            title
            publisher
          }
        }
      `,
    }),
  });

  const { data } = await rawdata.json();
  const dbGames = data ? data.games : [];
  const dbSPIELGames = data ? data.SPIELgames : [];

  const bggGames = bggData as ImportedData[];
  const SPIELGames = SPIELData as SPIELProductData[];

  const gameIdList = dbGames
    ? dbGames.filter((dbGame: Game) => dbGame.previewid !== null).map((game: Game) => game.previewid)
    : [];

  const newBGGgames = bggGames.filter((bggGame: ImportedData) => !gameIdList.includes(Number(bggGame.itemid)));

  const newSPIELgames = dbSPIELGames
    ? SPIELGames.filter(
        (SPIELGame: SPIELProductData) =>
          !dbSPIELGames.find(
            (dbSPIELGame: SPIELGame) =>
              dbSPIELGame.title === SPIELGame.TITEL && dbSPIELGame.publisher === SPIELGame.UNTERTITEL
          )
      )
    : SPIELGames;

  const newDBgames = newBGGgames.map((game) => game.itemid);

  return { newDBgames, newSPIELgames };
}

export async function importSPIELData() {
  // all the action happens in the resolver because we need dbGames
  const rawdata = await fetch("http://localhost:4000/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify({
      query: `
        mutation {
          importSPIELData { spielid }
        }
      `,
    }),
  });
  const data = await rawdata.json();

  return data;
}

export async function addBGGData() {
  // all the action happens in the resolver because we need dbGames
  const rawdata = await fetch("http://localhost:4000/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
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
  })
    .then((res) => res.json())
    .catch((error) => console.error(error));
}

export async function editGame(gameid: number, formState: GameInput) {
  await fetch(`http://localhost:3000/api/games/${gameid}/edit`, {
    method: "POST",
    body: JSON.stringify(formState),
  })
    .then((res) => res.json())
    .catch((error) => console.error(error));
}

export async function getGameMetadata() {
  const rawdata = await fetch("http://localhost:4000/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify({
      query: `
        query {
          publishers {
            publisherid
            bggid
            name
            country
            contacts
          }
          designers {
            designerid
            bggid
            name
          }
        }
      `,
    }),
  });
  const { data } = await rawdata.json();

  return data;
}
