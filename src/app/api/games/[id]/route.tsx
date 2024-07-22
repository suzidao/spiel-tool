/** @format */

import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  let gameId = req.url?.split("/").pop();

  const rawdata = await fetch("http://localhost:4000/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify({
      query: `
          query ($id: String) {
            entry (id: $id) {
              objectid
              msrp
              showprice
              msrp_currency
              showprice_currency
              location
              pretty_availability_status
              publishers {
                item {
                  objectid
                  href
                  primaryname {
                    name
                  }
                }
              }
              reactions {
                thumbs
              }
              version {
                item {
                  name
                  objectid
                  releasedate
                  overridedate
                }
              }
              geekitem {
                item {
                  href
                  subtypes
                  yearpublished
                  releasestatus
                  minplayers
                  maxplayers
                  minplaytime
                  maxplaytime
                  minage
                  links {
                    boardgamedesigner {
                      objectid
                      name
                      canonical_link
                    }
                    boardgamefamily {
                      objectid
                      name
                    }
                    reimplements {
                      objectid
                      name
                      canonical_link
                    }
                    boardgamecategory {
                      objectid
                      name
                    }
                    boardgamemechanic {
                      objectid
                      name
                    }
                  }
                  dynamicinfo {
                    item {
                      stats {
                        avgweight
                      }
                    }
                  }
                }
              }
            }
          }
        `,
      variables: { id: gameId },
    }),
  });
  const data = await rawdata.json();

  return NextResponse.json(data);
}
