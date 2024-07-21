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
            location
            availability_status
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

  return (
    <div className="flex min-h-screen flex-col p-6 lg:p-24">
      <div className="flex justify-between mb-8">
        <div>
          Total Games Listed: <strong>{games.length}</strong>
        </div>
        <div>
          <Link className="px-4 py-2" href="/api/scrapers/items">
            Download Games
          </Link>
          |
          <Link className="px-4 py-2" href="/api/scrapers/parents">
            Download Parents
          </Link>
        </div>
      </div>
      <DataTable data={games} />
    </div>
  );
}
