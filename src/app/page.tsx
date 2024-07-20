/** @format */

import axios from "axios";
import TableRow from "./components/TableRow";
import Link from "next/link";
import pubMeta from "../data/spiel-preview-parents.json";
import DataTable from "./components/DataTable";

export default async function Home() {
  // const games: Entry[] = await axios({
  //   url: "http://localhost:4000/graphql",
  //   method: "POST",
  //   data: {
  //     query: `
  //       query {
  //         entries {
  //           msrp
  //           showprice
  //           pretty_availability_status
  //           publishers {
  //             item {
  //               objectid
  //               href
  //               primaryname {
  //                 name
  //               }
  //             }
  //           }
  //           reactions {
  //             thumbs
  //           }
  //           version {
  //             item {
  //               releasedate
  //               overridedate
  //             }
  //           }
  //           geekitem {
  //             item {
  //               href
  //               subtypes
  //               yearpublished
  //               releasestatus
  //               minplayers
  //               maxplayers
  //               minplaytime
  //               maxplaytime
  //               minage
  //               links {
  //                 boardgamedesigner {
  //                   objectid
  //                   name
  //                   canonical_link
  //                 }
  //                 boardgamefamily {
  //                   objectid
  //                   name
  //                 }
  //                 reimplements {
  //                   name
  //                   canonical_link
  //                 }
  //               }
  //               primaryname {
  //                 nameid
  //                 name
  //               }
  //               dynamicinfo {
  //                 item {
  //                   stats {
  //                     avgweight
  //                   }
  //                 }
  //               }
  //             }
  //           }
  //         }
  //       }
  //     `,
  //   },
  // })
  //   .then((result) => {
  //     return result.data.data.entries;
  //   })
  //   .catch((error) => {
  //     return error;
  //   });

  // const editedGames = games.map((game: Entry) => {
  //   // retrieve location from publisher meta
  //   pubMeta.map((meta) => {
  //     if (game.publishers[0].item.objectid === meta.objectid)
  //       game.location = meta.location === null || meta.location === "" ? "–" : meta.location;
  //   });

  //   // consolidate & format release dates and release overrides
  //   const releasedate = game.version.item.releasedate;
  //   const overridedate = game.version.item.overridedate;

  //   const formattedReleaseDate = () => {
  //     if (overridedate) {
  //       return overridedate;
  //     } else if (releasedate) {
  //       if (releasedate === "0000-00-00") {
  //         return "–";
  //       } else if (releasedate.endsWith("-00-00")) {
  //         return releasedate.split("-")[0];
  //       } else if (releasedate.endsWith("-00")) {
  //         return releasedate.split("-")[1] + "-" + releasedate.split("-")[0];
  //       } else {
  //         return releasedate.split("-")[1] + "-" + releasedate.split("-")[2] + "-" + releasedate.split("-")[0];
  //       }
  //     }
  //   };
  //   game.version.item.releasedate = formattedReleaseDate();

  //   return game;
  // });

  return (
    <main className="flex min-h-screen flex-col p-6 lg:p-24">
      {/* <div className="flex justify-between mb-8">
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
      <DataTable data={editedGames} /> */}
      {/* <table>
        <thead>
          <tr>
            <th className="text-left">Game Title</th>
            <th className="text-left">Publisher</th>
            <th className="text-left">Designer(s)</th>
            <th className="text-left">Location</th>
            {/* <th className="min-w-12">👍</th> }
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
      </table> */}
    </main>
  );
}
