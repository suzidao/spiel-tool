/** @format */

import axios from "axios";
import TableRow from "./components/TableRow";
import Link from "next/link";

export default async function Home() {
  const games = await axios({
    url: "http://localhost:4000/graphql",
    method: "POST",
    data: {
      query: `
        query {
          entries {
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
                releasedate
                overridedate
              }
            }
            geekitem {
              item {
                href
                subtypes
                yearpublished
                minplayers
                maxplayers
                minplaytime
                maxplaytime
                minage
                links {
                  boardgamedesigner {
                    name
                    canonical_link
                  }
                  reimplements {
                    name
                    canonical_link
                  }
                }
                primaryname {
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
    <main className="flex min-h-screen flex-col justify-between p-24">
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
      <table>
        <thead>
          <tr>
            <th className="text-left">Game Title</th>
            <th className="text-left">Publisher</th>
            <th className="text-left">Designer(s)</th>
            <th className="text-left">Location</th>
            {/* <th className="min-w-12">👍</th> */}
            <th className="text-left">Release Date</th>
            <th>Min. Players</th>
            <th>Max. Players</th>
            <th>Min. Playtime</th>
            <th>Max. Playtime</th>
            <th>Complexity</th>
          </tr>
        </thead>
        {games.length > 0 && (
          <tbody>
            {games.map((game: any, idx: number) => {
              return <TableRow key={idx} game={game} />;
            })}
          </tbody>
        )}
      </table>
    </main>
  );
}
