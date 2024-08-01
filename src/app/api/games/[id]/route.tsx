/** @format */

import { editGame } from "@/utils/editData";
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
            itemid
            title
            publisher
            designers
            minplayers
            maxplayers
            minplaytime
            maxplaytime
            complexity
            contacts
            decision
            negotiation
            acquisition
            comments {
              commentid
              userid
              gameid
              comment
            }
            rankings {
              rankingid
              userid
              gameid
              ranking
            }
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

  const editedGame =
    game.itemid === null ? (editGame(game, false) as CombinedGame) : (editGame(game, true) as CombinedGame);

  return NextResponse.json(editedGame);
}
