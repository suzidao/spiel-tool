/** @format */

import Link from "next/link";
import { Fragment } from "react";
import BGGKeys from "../../data/bgg-keys.json";

export default function GameInfo(props: { game: Entry }) {
  const { game } = props;
  const { href, links, minplayers, maxplayers, minplaytime, maxplaytime, dynamicinfo } = game.geekitem.item;
  const publisher = game.publishers[0].item;

  const players = () => {
    return minplayers === maxplayers ? maxplayers : `${minplayers} – ${maxplayers}`;
  };

  const playtime = () => {
    return minplaytime === maxplaytime ? maxplaytime : `${minplaytime} – ${maxplaytime}`;
  };

  const price = () => {
    return game.showprice > 0
      ? `${game.showprice} ${game.showprice_currency}`
      : game.msrp > 0
      ? `${game.msrp} ${game.msrp_currency}`
      : `?? ${game.msrp_currency}`;
  };

  return (
    <div>
      <div className="my-4 flex items-center">
        <span className="text-xs uppercase font-medium">{game.pretty_availability_status}</span>
        {game.pretty_availability_status === "For Sale" && `: ${price()}`}
      </div>
      <div className="my-4">
        <span className="pr-2 font-medium">Game Title:</span>
        <Link href={`https://boardgamegeek.com${href}`} target="_blank">
          {game.version.item.name}
        </Link>
      </div>
      <div className="my-4">
        <span className="pr-2 font-medium">Publisher:</span>
        <Link key={publisher.objectid} href={`https://boardgamegeek.com${publisher.href}`} target="_blank">
          {publisher.primaryname.name}
        </Link>
      </div>
      <div className="my-4">
        <span className="pr-2 font-medium">Designer(s):</span>
        {links.boardgamedesigner.map((designer: Designer, idx: number) => {
          const isLast = links.boardgamedesigner.length - 1 === idx;
          return (
            <Fragment key={designer.objectid}>
              <Link href={designer.canonical_link} target="_blank">
                {designer.name}
              </Link>
              {!isLast && ", "}
            </Fragment>
          );
        })}
      </div>
      <div className="my-4">
        <span className="pr-2 font-medium">Location:</span>
        {game.location}
      </div>
      <div className="my-4">
        <span className="pr-2 font-medium">Thumbs:</span>
        {game.reactions.thumbs > 0 ? game.reactions.thumbs : "–"}
      </div>
      <div className="my-4">
        <span className="pr-2 font-medium">Release Date:</span>
        {game.version.item.releasedate}
      </div>
      <div className="my-4">
        <span className="pr-2 font-medium">Player Count:</span>
        {players()} players
      </div>
      <div className="my-4">
        <span className="pr-2 font-medium">Playtime:</span>
        {playtime()} minutes
      </div>
      <div className="my-4">
        <span className="pr-2 font-medium">Complexity:</span>
        {Number(dynamicinfo.item.stats.avgweight).toFixed(2)}
      </div>
      <div className="my-4">
        <span className="pr-2 font-medium">Mechanics:</span>
        <ul className="ml-4 my-2">
          {links.boardgamemechanic.map((mechanic) => {
            return (
              <li key={mechanic.objectid} className="my-1">
                {mechanic.name}
              </li>
            );
          })}
        </ul>
      </div>
      <div className="my-4">
        <span className="pr-2 font-medium">Digital Implementations:</span>
        <ul className="ml-4 my-2">
          {links.boardgamefamily.map((family) => {
            const keys = BGGKeys.digital_implementations.map((key) => key.objectid);

            if (keys.includes(family.objectid)) {
              const platforms = BGGKeys.digital_implementations.filter((key) => {
                return key.objectid === family.objectid;
              });
              return platforms.map((platform) => {
                return (
                  <li key={platform.objectid} className="my-1">
                    {platform.name}
                  </li>
                );
              });
            }
          })}
        </ul>
      </div>
    </div>
  );
}
