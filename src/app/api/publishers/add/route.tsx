/** @format */

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const publisherName = await req.json();

  const publisherInput = {
    bggid: null,
    name: publisherName,
    country: null,
    contacts: null,
  };

  const rawdata = await fetch("http://localhost:4000/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify({
      query: `
        mutation ($input: PublisherInput){
          addPublisher(input: $input) { publisherid }
        }
      `,
      variables: { input: publisherInput },
    }),
  });

  const { data } = await rawdata.json();

  return NextResponse.json(data);
}
