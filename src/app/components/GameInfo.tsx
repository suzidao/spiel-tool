/** @format */

import Link from "next/link";
import { Fragment } from "react";
import BGGKeys from "../../data/bgg-keys.json";

export default function GameInfo(props: { game: CombinedGame }) {
  const {
    title,
    publisher,
    publisher_link,
    designers,
    thumbs,
    location,
    releasedate,
    releasestatus,
    game_link,
    minplayers,
    maxplayers,
    minplaytime,
    maxplaytime,
    yearpublished,
    minage,
    expands,
    reimplements,
    mechanics,
    digitized,
    complexity,
    showprice,
    showprice_currency,
    msrp,
    msrp_currency,
    availability_status,
  } = props.game;

  const players = () => {
    return minplayers === maxplayers ? maxplayers : `${minplayers} – ${maxplayers}`;
  };

  const playtime = () => {
    return minplaytime === maxplaytime ? maxplaytime : `${minplaytime} – ${maxplaytime}`;
  };

  const price = () => {
    return !!showprice && showprice > 0
      ? `${showprice} ${showprice_currency}`
      : !!msrp && msrp > 0
      ? `${msrp} ${msrp_currency}`
      : `?? ${msrp_currency}`;
  };

  const availabilityStatus = BGGKeys.availability_statuses.find(
    (key: { objectid: string; name: string }) => key.objectid === availability_status
  )?.name;

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
      {expands.length > 0 && (
        <div className="mb-4 text-xs uppercase">
          <span className="pr-1 font-semibold">Expansion For:</span>
          {expands.map((game, idx) => {
            const isLast = expands.length - 1 === idx;

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
              (availability_status === "demo" ? "text-black bg-yellow-500" : "") +
              (availability_status === "forsale" ? "text-white bg-green-600 mr-2" : "")
            }
          >
            {availabilityStatus}
          </span>
          {availability_status === "forsale" && ` ${price()}`}
        </div>
        <div>
          <span className="pr-2 font-medium whitespace-nowrap">Location:</span>
          {location}
        </div>
        <div className="ml-auto justify-self-end">
          {!!thumbs && thumbs > 0 ? thumbs : "–"}
          <span className="pl-2 font-medium">👍</span>
        </div>
      </div>
      <div className="my-4">
        <span className="pr-2 font-medium whitespace-nowrap">Game Title:</span>
        <Link href={game_link} target="_blank">
          {title} ({yearpublished})
        </Link>
      </div>
      <div className="my-4">
        <span className="pr-2 font-medium whitespace-nowrap">Publisher:</span>
        <Link key={publisher} href={publisher_link} target="_blank">
          {publisher}
        </Link>
      </div>
      <div className="my-4">
        <span className="pr-2 font-medium whitespace-nowrap">Designer(s):</span>
        {designers.map((designer, idx) => {
          const isLast = designers.length - 1 === idx;
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
          {!!minage && minage.length > 0 ? minage : "–"}+
        </div>
        <div className="w-1/2">
          <span className="pr-2 font-medium whitespace-nowrap">Complexity:</span>
          {!!complexity && Number(complexity) > 0 ? complexity : "–"}
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
            {mechanics.map((mechanic) => {
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
            {digitized.map((digitization) => {
              const keys = BGGKeys.digital_implementations.map((key) => key.objectid);

              if (keys.includes(digitization.objectid)) {
                const platforms = BGGKeys.digital_implementations.filter((key) => {
                  return key.objectid === digitization.objectid;
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
