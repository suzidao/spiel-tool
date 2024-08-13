/** @format */

import { NextResponse } from "next/server";
import { extendGame } from "../../../utils/editData";

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
              bggid
              previewid
              title
              publisher {
                publisherid
                bggid
                name
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
              yearpublished
              decision
              negotiation
              acquisition
            }
          }
        `,
    }),
  });

  const { data } = await rawDB.json();
  const games = data.games;

  let allGames: Game[] = [];

  games.map((game: Game) => {
    const editedGame = game.previewid === null ? game : extendGame(game);

    allGames.push(editedGame as Game);
  });

  return NextResponse.json(allGames);
}
