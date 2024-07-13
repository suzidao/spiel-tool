/** @format */

import express from "express";
import { createHandler } from "graphql-http/lib/use/express";
import schema from "./schema";
import { root } from "./resolvers";

const server = express();

server.use(
  "/graphql",
  createHandler({
    schema: schema,
    rootValue: root,
  })
);

export default server;
