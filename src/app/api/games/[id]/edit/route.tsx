/** @format */

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const reqData = await req.json();
  const gameid = reqData.gameid;

  const gameInput = {
    bggid: reqData.bggid,
    previewid: reqData.previewid,
    title: reqData.title,
    publisher: reqData.publisher,
    designers: reqData.designers,
    minplayers: Number(reqData.minplayers),
    maxplayers: Number(reqData.maxplayers),
    minplaytime: Number(reqData.minplaytime),
    maxplaytime: Number(reqData.maxplaytime),
    complexity: Number(reqData.complexity),
    minage: Number(reqData.minage),
    location: reqData.location,
    yearpublished: Number(reqData.yearpublished),
    decision: reqData.decision,
    negotiation: reqData.negotiation,
    acquisition: reqData.acquisition,
    numhave: Number(reqData.numhave),
    numneed: Number(reqData.numneed),
    numpromise: Number(reqData.numpromise),
  };

  const rawdata = await fetch("http://localhost:4000/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify({
      query: `
        mutation ($id: Int, $input: GameInput) {
          editGame (gameid: $id, input: $input) { gameid }
        }
      `,
      variables: { id: gameid, input: gameInput },
    }),
  });

  const { data } = await rawdata.json();

  return NextResponse.json(data);
}
