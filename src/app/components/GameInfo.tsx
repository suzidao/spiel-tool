/** @format */

"use client";

import Link from "next/link";
import { Fragment, useEffect, useMemo, useState } from "react";
import { DECISION, NEGOTIATION, ACQUISITION } from "@/types/common";
import BGGKeys from "@/data/bgg-keys.json";
import { formatPlayerCount, formatPlayTime } from "@/utils/editData";
import { saveNote, setAmount, updateStatus } from "@/app/actions";
import Button from "./Button";

function AmountField(props: { game: Game; numField: string }) {
  const { game, numField } = props;
  const [num, setNum] = useState(game[numField as keyof typeof game]);

  return (
    <div className="flex flex-row gap-2 items-center">
      <span className="uppercase font-semibold text-xs">{numField.split("num")[1]}</span>
      <button
        onClick={() => {
          setNum(num - 1);
          setAmount(game.gameid, numField, num - 1);
        }}
      >
        ➖
      </button>
      <div className="text-lg">{num ?? 0}</div>
      <button
        onClick={() => {
          setNum(num + 1);
          setAmount(game.gameid, numField, num + 1);
        }}
      >
        ➕
      </button>
    </div>
  );
}

export default function GameInfo(props: { game: Game }) {
  const game = useMemo(() => {
    return props.game;
  }, []);

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
    notes,
  } = game;

  const [decisionStatus, setDecisionStatus] = useState<string>(decision);
  const [negotiationStatus, setNegotiationStatus] = useState<string>(negotiation);
  const [acquisitionStatus, setAcquisitionStatus] = useState<string>(acquisition);
  const [editNotes, setEditNotes] = useState<boolean>(false);

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
      <div className="flex flex-col bg-slate-200 p-4">
        <div className="flex flex-row justify-start gap-6">
          <label className="flex flex-row items-center gap-2">
            <span className="uppercase font-semibold text-xs">Decision</span>
            <select
              className="border border-gray-400 bg-white p-0.5 rounded"
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
              <span className="uppercase font-semibold text-xs">Negotiation</span>
              <select
                className="border border-gray-400 bg-white p-0.5 rounded"
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
              <span className="uppercase font-semibold text-xs">Acquisition</span>
              <select
                className="border border-gray-400 bg-white p-0.5 rounded"
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

        {negotiationStatus !== "none" && (
          <div className="flex flex-row gap-12 mt-4 items-center justify-center">
            {["numneed", "numpromise", "numhave"].map((numField) => (
              <AmountField key={numField} game={game} numField={numField} />
            ))}
          </div>
        )}

        <div className="flex flex-row gap-3 items-center justify-start mt-2 max-w-xl">
          <button
            className="self-start text-xl"
            onClick={() => {
              setEditNotes(!editNotes);
            }}
          >
            {editNotes ? "✏️" : "📝"}
          </button>
          {editNotes ? (
            <textarea
              className="border border-gray-400 p-2 w-full"
              defaultValue={notes}
              autoFocus
              onBlur={(e) => saveNote(gameid, e.target.value)}
            />
          ) : (
            <p>
              {!!notes && notes.length > 0 ? (
                notes
              ) : (
                <button
                  className="uppercase font-semibold text-xs"
                  onClick={() => {
                    setEditNotes(true);
                  }}
                >
                  Add a Note
                </button>
              )}
            </p>
          )}
        </div>
      </div>

      <div className="p-4">
        {!!reimplements && reimplements.length > 0 && (
          <div className="mb-2 text-xs uppercase">
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
          <div className="mb-2 text-xs uppercase">
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
        <div className="mb-2 flex flex-row items-center w-full">
          {availabilityStatus && (
            <div className="min-w-52 w-1/2 flex items-center tracking-looser uppercase font-medium">
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
          <div className="min-w-52 w-1/2 flex flex-row justify-between gap-6 items-center">
            <div className="flex flex-row items-center">
              <span className="pr-2 font-medium">Location:</span>
              <div className="flex flex-row flex-wrap">
                {location?.split(", ").map((text, idx) => {
                  const list = location?.split(", ");
                  return (
                    <span key={text + idx} className={(list.length > 1 && "whitespace-nowrap ") + "mr-1"}>
                      {text + (idx !== list.length - 1 ? ", " : "")}
                    </span>
                  );
                })}
              </div>
            </div>
            {!!thumbs && (
              <div className="ml-auto justify-self-end items-center flex">
                <span className="pr-2 font-medium text-xl -mt-1">👍</span>
                {thumbs > 0 ? thumbs : "–"}
              </div>
            )}
          </div>
        </div>
        <div className="my-3 pt-2">
          <span className="pr-2 font-medium">Game Title:</span>
          {!!bggid ? (
            <Link href={`https://boardgamegeek.com/boardgame/${bggid}`} target="_blank">
              {title} ({yearpublished})
            </Link>
          ) : (
            title
          )}
        </div>
        <div className="my-3">
          <span className="pr-2 font-medium">Publisher:</span>
          {publisher ? (
            !!publisher.bggid ? (
              <Link
                key={publisher.publisherid}
                href={`https://boardgamegeek.com/publisher/${publisher.bggid}`}
                target="_blank"
              >
                {publisher.name}
              </Link>
            ) : (
              publisher.name
            )
          ) : (
            <>—</>
          )}
        </div>
        <div className="my-3">
          <span className="pr-2 font-medium">Designer(s):</span>
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
        <div className="mt-6">
          <div className="my-3 flex flex-row">
            <div className="min-w-52 w-1/2 whitespace-nowrap">
              <span className="pr-2 font-medium">Player Count:</span>
              {!!minplayers || !!maxplayers ? `${formatPlayerCount(minplayers, maxplayers)} players` : "–"}
            </div>
            <div className="min-w-52 w-1/2 whitespace-nowrap">
              <span className="pr-2 font-medium">Playtime:</span>
              {!!minplaytime || !!maxplaytime ? `${formatPlayTime(minplaytime, maxplaytime)} minutes` : "–"}
            </div>
          </div>
          <div className="my-3 flex flex-row">
            <div className="min-w-52 w-1/2 whitespace-nowrap">
              <span className="pr-2 font-medium">Age:</span>
              {!!minage && minage > 0 ? `${minage}+` : "–"}
            </div>
            <div className="min-w-52 w-1/2 whitespace-nowrap">
              <span className="pr-2 font-medium">Complexity:</span>
              {!!complexity && Number(complexity) > 0 ? complexity : "–"}
            </div>
          </div>
          <div className="my-3 flex flex-row">
            <div className="min-w-52 w-1/2 whitespace-nowrap">
              <span className="pr-2 font-medium">Release Date:</span>
              {releasedate}
            </div>
            <div className="min-w-52 w-1/2 whitespace-nowrap">
              <span className="pr-2 font-medium">Release Status:</span>
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
        </div>
        {((mechanics && mechanics.length > 0) || (digitizations && digitizations.length > 0)) && (
          <div className="mt-6 flex flex-row">
            <div className="w-1/2">
              {mechanics.length > 0 && (
                <>
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
                </>
              )}
            </div>
            <div className="w-1/2">
              {digitizations.length > 0 && (
                <>
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
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-gray-400 py-4 flex justify-center gap-2">
        <Link href={`${gameid}/edit`}>
          <Button btnColor="green" btnText="Edit Game Info" />
        </Link>
      </div>
    </div>
  );
}
