/** @format */

import { NextApiRequest } from "next";
import { NextResponse } from "next/server";

export async function GET(req: NextApiRequest) {
  let spielId = Number(req.url?.split("/").pop());

  const rawdata = await fetch("http://localhost:4000/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify({
      query: `
        query ($id: Int) {
          SPIELgame (id: $id) {
            spielid
            title
            publisher
            designers
            minplayers
            maxplayers
            playtime
            complexity
            minage
            releasedate
            location
          }
        }
      `,
      variables: { id: spielId },
    }),
  });
  const { data } = await rawdata.json();

  return NextResponse.json(data);
}
