/** @format */

import axios from "axios";
import Link from "next/link";
import pubMeta from "../../data/spiel-preview-parents.json";
import DataTable from "../components/DataTable";

export default async function GamesPage() {
  const games: Entry[] = await axios({
    url: "http://localhost:4000/graphql",
    method: "POST",
    data: {
      query: `
        query {
          entries {
            objectid
            msrp
            showprice
            pretty_availability_status
            publishers {
              item {
                objectid
                href
                primaryname {
                  name
                }
              }
            }
            reactions {
              thumbs
            }
            version {
              item {
                objectid
                name
                releasedate
                overridedate
              }
            }
            geekitem {
              item {
                href
                subtypes
                yearpublished
                releasestatus
                minplayers
                maxplayers
                minplaytime
                maxplaytime
                minage
                links {
                  boardgamedesigner {
                    objectid
                    name
                    canonical_link
                  }
                  boardgamefamily {
                    objectid
                    name
                  }
                  boardgameversion {
                    objectid
                    name
                  }
                }
                primaryname {
                  nameid
                  name
                }
                dynamicinfo {
                  item {
                    stats {
                      avgweight
                    }
                  }
                }
              }
            }
          }
        }
      `,
    },
  })
    .then((result) => {
      return result.data.data.entries;
    })
    .catch((error) => {
      return error;
    });

  const editedGames = games.map((game: Entry) => {
    // retrieve location from publisher meta
    pubMeta.map((meta) => {
      if (game.publishers[0].item.objectid === meta.objectid)
        game.location = meta.location === null || meta.location === "" ? "–" : meta.location;
    });

    // consolidate & format release dates and release overrides
    const releasedate = game.version.item.releasedate;
    const overridedate = game.version.item.overridedate;

    const formattedReleaseDate = () => {
      if (overridedate) {
        return overridedate;
      } else if (releasedate) {
        if (releasedate === "0000-00-00") {
          return "–";
        } else if (releasedate.endsWith("-00-00")) {
          return releasedate.split("-")[0];
        } else if (releasedate.endsWith("-00")) {
          return releasedate.split("-")[1] + "-" + releasedate.split("-")[0];
        } else {
          return releasedate.split("-")[1] + "-" + releasedate.split("-")[2] + "-" + releasedate.split("-")[0];
        }
      }
    };
    game.version.item.releasedate = formattedReleaseDate();

    return game;
  });

  return (
    <div className="flex min-h-screen flex-col p-6 lg:p-24">
      <div className="flex justify-between mb-8">
        <div>
          Total Games Listed: <strong>{games.length}</strong>
        </div>
        <div>
          <Link className="px-4 py-2" href="/api/itemscraper">
            Download Games
          </Link>
          |
          <Link className="px-4 py-2" href="/api/parentscraper">
            Download Parents
          </Link>
        </div>
      </div>
      <DataTable data={editedGames} />
    </div>
  );
}
