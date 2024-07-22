/** @format */

import Link from "next/link";
import { Fragment } from "react";
import BGGKeys from "../../data/bgg-keys.json";

export default function GameInfo(props: { game: Entry }) {
  const { game } = props;
  const { name, releasedate, releasestatus } = game.version.item;
  const { href, minplayers, maxplayers, minplaytime, maxplaytime, dynamicinfo, yearpublished, minage } =
    game.geekitem.item;
  const { boardgamedesigner, boardgamefamily, expandsboardgame, reimplements, boardgamemechanic } =
    game.geekitem.item.links;
  const publisher = game.publishers[0].item;
  const complexity = Number(dynamicinfo.item.stats.avgweight);

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
    <div className="min-w-[420px] max-w-[960px] mx-auto bg-white">
      {reimplements.length > 0 && (
        <div className="mb-4 text-xs uppercase">
          <span className="pr-1 font-semibold">Reimplements:</span>
          {reimplements.map((game, idx) => {
            const isLast = reimplements.length - 1 === idx;

            return (
              <Fragment key={game.objectid}>
                <Link href={game.canonical_link} target="_blank" className="ml-1 tracking-wide">
                  {game.name}
                </Link>
                {!isLast && ", "}
              </Fragment>
            );
          })}
        </div>
      )}
      {expandsboardgame.length > 0 && (
        <div className="mb-4 text-xs uppercase">
          <span className="pr-1 font-semibold">Expansion For:</span>
          {expandsboardgame.map((game, idx) => {
            const isLast = expandsboardgame.length - 1 === idx;

            return (
              <Fragment key={game.objectid}>
                <Link href={game.canonical_link} target="_blank" className="ml-1 tracking-wide">
                  {game.name}
                </Link>
                {!isLast && ", "}
              </Fragment>
            );
          })}
        </div>
      )}
      <div className="mb-4 flex flex-row items-center w-full">
        <div className="w-1/2 flex items-center tracking-looser uppercase font-medium">
          <span
            className={
              "inline-block font-semibold text-xxs rounded-full px-2.5 py-1 " +
              (game.availability_status === "demo" ? "text-black bg-yellow-500" : "") +
              (game.availability_status === "forsale" ? "text-white bg-green-600 mr-2" : "")
            }
          >
            {game.pretty_availability_status}
          </span>
          {game.availability_status === "forsale" && ` ${price()}`}
        </div>
        <div>
          <span className="pr-2 font-medium whitespace-nowrap">Location:</span>
          {game.location}
        </div>
        <div className="ml-auto justify-self-end">
          {game.reactions.thumbs > 0 ? game.reactions.thumbs : "–"}
          <span className="pl-2 font-medium">👍</span>
        </div>
      </div>
      <div className="my-4">
        <span className="pr-2 font-medium whitespace-nowrap">Game Title:</span>
        <Link href={`https://boardgamegeek.com${href}`} target="_blank">
          {name} ({yearpublished})
        </Link>
      </div>
      <div className="my-4">
        <span className="pr-2 font-medium whitespace-nowrap">Publisher:</span>
        <Link key={publisher.objectid} href={`https://boardgamegeek.com${publisher.href}`} target="_blank">
          {publisher.primaryname.name}
        </Link>
      </div>
      <div className="my-4">
        <span className="pr-2 font-medium whitespace-nowrap">Designer(s):</span>
        {boardgamedesigner.map((designer, idx) => {
          const isLast = boardgamedesigner.length - 1 === idx;
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
      <div className="my-4 flex flex-row">
        <div className="w-1/2">
          <span className="pr-2 font-medium whitespace-nowrap">Player Count:</span>
          {players()} players
        </div>
        <div className="w-1/2">
          <span className="pr-2 font-medium whitespace-nowrap">Playtime:</span>
          {playtime()} minutes
        </div>
      </div>
      <div className="my-4 flex flex-row">
        <div className="w-1/2">
          <span className="pr-2 font-medium whitespace-nowrap">Age:</span>
          {minage.length > 0 ? minage : "–"}+
        </div>
        <div className="w-1/2">
          <span className="pr-2 font-medium whitespace-nowrap">Complexity:</span>
          {complexity > 0 ? complexity.toFixed(2) : "–"}
        </div>
      </div>
      <div className="my-4 flex flex-row">
        <div className="w-1/2">
          <span className="pr-2 font-medium whitespace-nowrap">Release Date:</span>
          {releasedate}
        </div>
        <div className="w-1/2">
          <span className="pr-2 font-medium whitespace-nowrap">Release Status:</span>
          {releasestatus ? (
            <div
              className={
                "inline-block font-semibold text-xxs uppercase rounded-full px-2.5 py-1 " +
                (releasestatus === "unreleased" ? "bg-gray-300" : "") +
                (releasestatus === "released" ? "bg-green-300" : "")
              }
            >
              {releasestatus}
            </div>
          ) : (
            "–"
          )}
        </div>
      </div>
      <div className="my-4 flex flex-row">
        <div className="w-1/2">
          <span className="pr-2 font-medium whitespace-nowrap">Mechanics:</span>
          <ul className="ml-4 my-2">
            {boardgamemechanic.map((mechanic) => {
              return (
                <li key={mechanic.objectid} className="my-1">
                  {mechanic.name}
                </li>
              );
            })}
          </ul>
        </div>
        <div className="w-1/2">
          <span className="pr-2 font-medium whitespace-nowrap">Digital Implementations:</span>
          <ul className="ml-4 my-2">
            {boardgamefamily.map((family) => {
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
    </div>
  );
}
