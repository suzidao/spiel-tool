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
  const previewItems: ImportedBGGData[] = [];
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
  const response = await fetch("https://maps.eyeled-services.de/en/spiel24/products", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
    cache: "no-store",
  });

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
            appid
            spielid
            gameid
            title
            publisher
            designers
            releasedate
            minplayers
            maxplayers
            playtime
            complexity
            minage
            location
            categories
            ignore
            subtypes
            created_at
            updated_at
          }
          games {
            gameid
            previewid
            spielid
            title
            publisher {
              publisherid
              bggid
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
  const { data } = await rawdata.json();
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

export async function addSPIELGame(game: SPIELGame) {
  delete game.gameid;
  const gamePrep = { ...game };
  const { spielid, ...gameInput } = gamePrep;
  await fetch("http://localhost:4000/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify({
      query: `
        mutation ($spielid: Int, $input: SPIELInput) {
          addSPIELGame (spielid: $spielid, input: $input) { spielid }
        }
      `,
      variables: { spielid: game.spielid, input: gameInput },
    }),
  })
    .then((res) => res.json().then((data) => data))
    .catch((error) => console.error(error));
}

export async function addNewGame(formState: GameInput) {
  await fetch("http://localhost:3000/api/games/add", {
    method: "POST",
    body: JSON.stringify(formState),
  })
    .then((res) => res)
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

export async function editPublisher(publisherid: number, input: PublisherInput) {
  await fetch(`http://localhost:4000/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
        mutation ($publisherid: Int, $input: PublisherInput) {
          editPublisher (publisherid: $publisherid, input: $input) { publisherid }
        }
      `,
      variables: { publisherid: publisherid, input: input },
    }),
  });
}

export async function editDesigner(designerid: number, input: DesignerInput) {
  await fetch(`http://localhost:4000/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
        mutation ($designerid: Int, $input: DesignerInput) {
          editDesigner (designerid: $designerid, input: $input) { designerid }
        }
      `,
      variables: { designerid: designerid, input: input },
    }),
  });
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

export async function updateStatus(gameid: number, status: string, value: string) {
  await fetch("http://localhost:4000/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
        mutation ($gameid: Int, $status: String, $value: String) {
          editStatus (gameid: $gameid, status: $status, value: $value) {
            gameid
          }
        }
      `,
      variables: { gameid: gameid, status: status, value: value },
    }),
  })
    .then((res) => res.json().then((data) => data))
    .catch((error) => console.error(error));
}

export async function saveNote(gameid: number, value: string) {
  await fetch("http://localhost:4000/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
        mutation ($gameid: Int, $note: String) {
          saveNote (gameid: $gameid, note: $note) { gameid }
        }
      `,
      variables: { gameid: gameid, note: value },
    }),
  })
    .then((res) => res.json().then((data) => data))
    .catch((error) => console.error(error));
}

export async function setAmount(gameid: number, numField: string, value: number) {
  await fetch("http://localhost:4000/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
        mutation ($gameid: Int, $numField: String, $value: Int) {
          setAmount (gameid: $gameid, numField: $numField, value: $value) { gameid }
        }
      `,
      variables: { gameid: gameid, numField: numField, value: value },
    }),
  })
    .then((res) => res.json().then((data) => data))
    .catch((error) => console.error(error));
}
