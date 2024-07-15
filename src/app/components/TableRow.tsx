/** @format */

import axios from "axios";
import Link from "next/link";
import { release } from "os";

export default async function TableRow(props: { game: any }) {
  const { game } = props;
  const { links, primaryname, minplayers, maxplayers, minplaytime, maxplaytime, dynamicinfo, href } =
    props.game.geekitem.item;
  const avgweight = dynamicinfo.item.stats.avgweight;
  const releasedate = game.version.item.releasedate;
  const overridedate = game.version.item.overridedate;

  const formattedReleaseDate = () => {
    if (releasedate) {
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

  const location = () => {
    if (metaLocation) {
      switch (metaLocation.location) {
        case null:
        case "":
          return "–";
        default:
          return metaLocation.location;
      }
    } else {
      return "–";
    }
  };

  const metaLocation = await axios({
    url: "http://localhost:4000/graphql",
    method: "POST",
    data: {
      query: `
        query($id: ID!) {
          location(id: $id) {
            location
          }
        }
      `,
      variables: { id: game.publishers[0].item.objectid },
    },
  }).then((result) => {
    return result.data.data.location;
  });

  return (
    <tr className="border-b border-gray-400" key={game.objectid}>
      <td className="py-2">
        <Link href={`https://boardgamegeek.com${href}`} target="_blank">
          {primaryname.name}
        </Link>
      </td>
      <td className="py-2">
        {game.publishers.map((publisher: any, idx: number) => {
          var isLast = idx === game.publishers.length - 1;
          return (
            <>
              <Link key={idx} href={`https://boardgamegeek.com${publisher.item.href}`} target="_blank">
                {publisher.item.primaryname.name}
              </Link>
              {!isLast && " | "}
            </>
          );
        })}
      </td>
      <td className="py-2">
        {links.boardgamedesigner.map((designer: any, idx: number) => {
          var isLast = idx === links.boardgamedesigner.length - 1;
          return (
            <>
              <Link key={idx} href={designer.canonical_link} target="_blank">
                {designer.name}
              </Link>
              {!isLast && ", "}
            </>
          );
        })}
      </td>
      <td className="py-2">{location()}</td>
      {/* <td className="py-2 text-center">{game.reactions.thumbs > 0 ? game.reactions.thumbs : "–"}</td> */}
      <td className="py-2 whitespace-nowrap">{overridedate ? overridedate : formattedReleaseDate()}</td>
      <td className="py-2 text-center">{minplayers > 0 ? minplayers : "–"}</td>
      <td className="py-2 text-center">{maxplayers > 0 ? maxplayers : "–"}</td>
      <td className="py-2 text-center">{minplaytime > 0 ? minplaytime : "–"}</td>
      <td className="py-2 text-center">{maxplaytime > 0 ? maxplaytime : "–"}</td>
      <td className="py-2 text-center">{avgweight > 0 ? Number(avgweight).toFixed(2) : "–"}</td>
    </tr>
  );
}
