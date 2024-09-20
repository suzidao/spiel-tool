/** @format */

"use client";

import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { DECISION, NEGOTIATION, ACQUISITION } from "@/types/common";
import BGGKeys from "@/data/bgg-keys.json";
import { formatPlayerCount, formatPlayTime } from "@/utils/editData";
import { updateStatus } from "@/app/actions";
import Button from "./Button";

export default function GameInfo(props: { game: Game }) {
  const {
    gameid,
    bggid,
    title,
    publisher,
    designers,
    thumbs,
    location,
    releasedate,
    releasestatus,
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
    decision,
    negotiation,
    acquisition,
  } = props.game;

  const [decisionStatus, setDecisionStatus] = useState<string>(decision);
  const [negotiationStatus, setNegotiationStatus] = useState<string>(negotiation);
  const [acquisitionStatus, setAcquisitionStatus] = useState<string>(acquisition);

  useEffect(() => {
    updateStatus(gameid, "decision", decisionStatus);
  }, [decisionStatus]);

  useEffect(() => {
    updateStatus(gameid, "negotiation", negotiationStatus);
  }, [negotiationStatus]);

  useEffect(() => {
    updateStatus(gameid, "acquisition", acquisitionStatus);
  }, [acquisitionStatus]);

  const decisionOptions = Object.entries(DECISION);
  const negotiationOptions = Object.entries(NEGOTIATION);
  const acquisitionOptions = Object.entries(ACQUISITION);

  const digitizations = digitized
    ? digitized.filter((type) => BGGKeys.digital_implementations.map((key) => key.objectid).includes(type.objectid))
    : [];

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
      <div className="flex flex-row justify-start gap-6 mb-6">
        <label className="flex flex-row items-center gap-2">
          Decision:
          <select
            className="border border-gray-400 bg-white py-0.5 rounded"
            onChange={(e) => setDecisionStatus(e.target.value)}
            defaultValue={decisionStatus}
            name="decision"
          >
            {decisionOptions.map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </select>
        </label>
        {!["none", "rejected"].includes(decisionStatus) && (
          <label className="flex flex-row items-center gap-2">
            Negotiation:
            <select
              className="border border-gray-400 bg-white py-0.5 rounded"
              onChange={(e) => setNegotiationStatus(e.target.value)}
              defaultValue={negotiationStatus}
              name="negotiation"
            >
              {negotiationOptions.map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </select>
          </label>
        )}
        {negotiationStatus !== "none" && (
          <label className="flex flex-row items-center gap-2">
            Acquisition:
            <select
              className="border border-gray-400 bg-white py-0.5 rounded"
              onChange={(e) => setAcquisitionStatus(e.target.value)}
              defaultValue={acquisitionStatus}
              name="acquisition"
            >
              {acquisitionOptions.map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      {!!reimplements && reimplements.length > 0 && (
        <div className="mb-4 text-xs uppercase">
          <span className="pr-1 font-semibold">Reimplements:</span>
          {reimplements.map((game, idx) => {
            const isLast = reimplements.length - 1 === idx;

            return (
              <Fragment key={game.objectid}>
                <Link
                  href={`https://boardgamegeek.com/boardgame/${game.objectid}`}
                  target="_blank"
                  className="ml-1 tracking-wide"
                >
                  {game.name}
                </Link>
                {!isLast && ", "}
              </Fragment>
            );
          })}
        </div>
      )}
      {!!expands && expands.length > 0 && (
        <div className="mb-4 text-xs uppercase">
          <span className="pr-1 font-semibold">Expansion For:</span>
          {expands.map((game, idx) => {
            const isLast = expands.length - 1 === idx;

            return (
              <Fragment key={game.objectid}>
                <Link
                  href={`https://boardgamegeek.com/boardgame/${game.objectid}`}
                  target="_blank"
                  className="ml-1 tracking-wide"
                >
                  {game.name}
                </Link>
                {!isLast && ", "}
              </Fragment>
            );
          })}
        </div>
      )}
      <div className="mb-4 flex flex-row items-center w-full">
        {availabilityStatus && (
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
        )}
        <div>
          <span className="pr-2 font-medium whitespace-nowrap">Location:</span>
          {location}
        </div>
        {!!thumbs && (
          <div className="ml-auto justify-self-end">
            {thumbs > 0 ? thumbs : "–"}
            <span className="pl-2 font-medium">👍</span>
          </div>
        )}
      </div>
      <div className="my-4">
        <span className="pr-2 font-medium whitespace-nowrap">Game Title:</span>
        {!!bggid ? (
          <Link href={`https://boardgamegeek.com/boardgame/${bggid}`} target="_blank">
            {title} ({yearpublished})
          </Link>
        ) : (
          title
        )}
      </div>
      <div className="my-4">
        <span className="pr-2 font-medium whitespace-nowrap">Publisher:</span>
        {!!publisher.bggid ? (
          <Link
            key={publisher.publisherid}
            href={`https://boardgamegeek.com/publisher/${publisher.bggid}`}
            target="_blank"
          >
            {publisher.name}
          </Link>
        ) : (
          publisher.name
        )}
      </div>
      <div className="my-4">
        <span className="pr-2 font-medium whitespace-nowrap">Designer(s):</span>
        {!!designers &&
          designers.map((designer, idx) => {
            const isLast = designers.length - 1 === idx;
            return designer.bggid ? (
              <Fragment key={designer.bggid}>
                <Link href={`https://boardgamegeek.com/boardgamedesigner/${designer.bggid}`} target="_blank">
                  {designer.name}
                </Link>
                {!isLast && ", "}
              </Fragment>
            ) : (
              <Fragment key={designer.name}>
                {designer.name}
                {!isLast && ", "}
              </Fragment>
            );
          })}
      </div>
      <div className="my-4 flex flex-row">
        <div className="w-1/2">
          <span className="pr-2 font-medium whitespace-nowrap">Player Count:</span>
          {!!minplayers || !!maxplayers ? `${formatPlayerCount(minplayers, maxplayers)} players` : "–"}
        </div>
        <div className="w-1/2">
          <span className="pr-2 font-medium whitespace-nowrap">Playtime:</span>
          {!!minplaytime || !!maxplaytime ? `${formatPlayTime(minplaytime, maxplaytime)} minutes` : "–"}
        </div>
      </div>
      <div className="my-4 flex flex-row">
        <div className="w-1/2">
          <span className="pr-2 font-medium whitespace-nowrap">Age:</span>
          {!!minage && minage > 0 ? `${minage}+` : "–"}
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
        {mechanics && (
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
        )}
        {digitizations.length > 0 && (
          <div className="w-1/2">
            <span className="pr-2 font-medium whitespace-nowrap">Digital Implementations:</span>
            <ul className="ml-4 my-2">
              {digitizations.map((digitization) => {
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
              })}
            </ul>
          </div>
        )}
      </div>
      <div className="border-t border-gray-400 pt-4 flex justify-center gap-2">
        <Link href={`${gameid}/edit`}>
          <Button btnColor="green" btnText="Edit" />
        </Link>
      </div>
    </div>
  );
}
