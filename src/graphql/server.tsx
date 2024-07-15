/** @format */

import express from "express";
import { createHandler } from "graphql-http/lib/use/express";
import schema from "./schema";
import { root } from "./resolvers";

const server = express();
server.set("etag", false);
server.use(
  "/graphql",
  (req, res, next) => {
    res.set("Cache-Control", "no-store");
    next();
  },
  createHandler({
    schema: schema,
    rootValue: root,
  })
);

export default server;
