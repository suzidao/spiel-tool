/** @format */

import { NextResponse } from "next/server";
import { editGame } from "../../../utils/editData";

export async function GET() {
  const rawDB = await fetch("http://localhost:4000/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify({
      query: `
          query {
            games {
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
            }
          }
        `,
    }),
  });

  const { data } = await rawDB.json();

  const games = data.games;
  const allGames: CombinedGame[] = [];

  games.map((game: any) => {
    const editedGame = game.itemid === null ? editGame(game, false) : editGame(game, true);

    allGames.push(editedGame as CombinedGame);
  });

  return NextResponse.json(allGames);
}
