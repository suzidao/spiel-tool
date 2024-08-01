/** @format */

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const reqData = await req.json();

  const gameInput = {
    title: reqData.title,
    publisher: reqData.publisher,
    designers: reqData.designers,
    minplayers: Number(reqData.minplayers),
    maxplayers: Number(reqData.maxplayers),
    minplaytime: Number(reqData.minplaytime),
    maxplaytime: Number(reqData.maxplaytime),
    complexity: Number(reqData.complexity),
    contacts: JSON.stringify(reqData.contacts),
    decision: reqData.decision,
    negotiation: reqData.negotiation,
    acquisition: reqData.acquisition,
    comments: reqData.comments,
    rankings: reqData.rankings,
    interest: reqData.interest,
    numhave: Number(reqData.numhave),
    numneed: Number(reqData.numneed),
    numpromise: Number(reqData.numpromise),
  };

  const rawdata = await fetch("http://localhost:4000/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
        mutation ($input: GameInput){
          addGame (input: $input) { gameid }
        }
      `,
      variables: { input: gameInput },
    }),
  });
  const data = await rawdata.json();

  return NextResponse.json(data);
}
