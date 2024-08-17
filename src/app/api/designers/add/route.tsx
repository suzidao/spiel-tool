/** @format */

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const designerName = await req.json();

  const designerInput = {
    bggid: null,
    name: designerName,
  };

  const rawdata = await fetch("http://localhost:4000/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify({
      query: `
        mutation ($input: DesignerInput){
          addDesigner(input: $input) { designerid }
        }
      `,
      variables: { input: designerInput },
    }),
  });

  const { data } = await rawdata.json();

  return NextResponse.json(data);
}
