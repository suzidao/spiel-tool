/** @format */

import { NextRequest, NextResponse } from "next/server";
import gamesData from "../../../data/spiel-preview-games.json";
import pubMetaData from "../../../data/spiel-preview-parents.json";

export async function GET(req: NextRequest) {
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
              designers {
                name
                canonical_link
              }
              minplayers
              maxplayers
              minplaytime
              maxplaytime
              complexity
              contact
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

  const bggData = gamesData as Entry[];
  const pubMeta = pubMetaData as PublisherMeta[];

  const allGames: CombinedGame[] = [];

  games.map((game: Game) => {
    if (game.itemid === null) {
      allGames.push(game as CombinedGame);
    } else {
      const entry = bggData.find((entry: Entry) => entry.itemid === game.itemid?.toString());
      if (!!entry) {
        const matchingMeta = pubMeta.find(
          (meta: PublisherMeta) => meta.objectid === entry.publishers[0].item.objectid.toString()
        );
        const editedGame: CombinedGame = {
          gameid: game.gameid,
          title: entry.version.item.name,
          publisher: entry.publishers[0].item.primaryname.name,
          designers: entry.geekitem.item.links.boardgamedesigner,
          minplayers: entry.geekitem.item.minplayers,
          maxplayers: entry.geekitem.item.maxplayers,
          minplaytime: entry.geekitem.item.minplaytime,
          maxplaytime: entry.geekitem.item.maxplaytime,
          complexity: entry.geekitem.item.dynamicinfo.item.stats.avgweight,
          game_link: `https://boardgamegeek.com${entry.geekitem.item.href}`,
          publisher_link: `https://boardgamegeek.com${entry.publishers[0].item.href}`,
          location: matchingMeta
            ? matchingMeta.location === null || matchingMeta.location === ""
              ? "–"
              : matchingMeta.location
            : "–",
          msrp: entry.msrp,
          showprice: entry.showprice,
          msrp_currency: entry.msrp_currency,
          showprice_currency: entry.showprice_currency,
          availability_status: entry.availability_status,
          thumbs: entry.reactions.thumbs,
          subtypes: entry.geekitem.item.subtypes,
          yearpublished: entry.geekitem.item.yearpublished,
          minage: entry.geekitem.item.minage,
          mechanics: entry.geekitem.item.links.boardgamemechanic,
          expands: entry.geekitem.item.links.expandsboardgame,
          reimplements: entry.geekitem.item.links.reimplements,
          digitized: entry.geekitem.item.links.boardgamefamily,
        };

        allGames.push(editedGame);
        return editedGame;
      }
    }
  });

  return NextResponse.json(allGames);
}
