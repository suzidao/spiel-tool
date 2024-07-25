/** @format */

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const rawdata = await fetch("http://localhost:4000/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify({
      query: `
        query {
          users {
            username
          }
        }
      `,
    }),
  });
  const data = await rawdata.json();

  return NextResponse.json(data);
}
