/** @format */

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const reqData = await req.formData();

  const userInput = {
    username: reqData.get("username"),
    password: reqData.get("password"),
    email: reqData.get("email"),
  };

  const rawdata = await fetch("http://localhost:4000/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify({
      query: `
        mutation ($input: UserInput){
          addUser(input: $input) { userid }
        }
      `,
      variables: { input: userInput },
    }),
  });
  const data = await rawdata.json();

  return NextResponse.json(data);
}
