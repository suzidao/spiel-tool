/** @format */

import { NextApiRequest } from "next";
import { NextResponse } from "next/server";

export async function GET(req: NextApiRequest) {
  let gameId = Number(req.url?.split("/").pop());

  const rawdata = await fetch("http://localhost:4000/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify({
      query: `
        query ($id: Int) {
          game (id: $id) {
            gameid
            bggid
            previewid
            title
            publisher {
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
            minplayers
            maxplayers
            minplaytime
            maxplaytime
            complexity
            minage
            location
            decision
            negotiation
            acquisition
            yearpublished
            numhave
            numneed
            numpromise
          }
        }
      `,
      variables: { id: gameId },
    }),
  });
  const { data } = await rawdata.json();

  const game = data.game;

  return NextResponse.json(game);
}
