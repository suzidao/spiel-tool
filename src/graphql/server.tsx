/** @format */

import express from "express";
import { createHandler } from "graphql-http/lib/use/express";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { schema } from "./schema";
import { resolvers } from "./resolvers";

const fullSchema = makeExecutableSchema({
  typeDefs: schema,
  resolvers,
});

const server = express();
server.set("etag", false);
server.use(
  "/graphql",
  (req, res, next) => {
    res.set("Cache-Control", "no-store");
    next();
  },
  createHandler({ schema: fullSchema })
);

export default server;
