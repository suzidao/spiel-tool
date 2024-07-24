/** @format */

import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  let userId = req.url?.split("/").pop();

  const rawdata = await fetch("http://localhost:4000/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify({
      query: `
        query ($id: Int) {
          user (userid: $id) {
            username
            password
            email
            comments
            rankings
            interest
          }
        }
      `,
      variables: { id: userId },
    }),
  });
  const data = await rawdata.json();

  return NextResponse.json(data);
}
