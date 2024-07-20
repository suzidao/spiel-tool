/** @format */

import { buildSchema } from "graphql";

const schema = buildSchema(`
  type Entry {
    itemid: ID!
    objectid: String
    geekitem: GeekItem!
    version: Version
    msrp: Float
    showprice: Float
    location: String
    pretty_availability_status: String
    reactions: Reactions
    publishers: [Publisher]
  }
  
  type Reactions {
    thumbs: Int
  }

  type GeekItem {
    item: Game
  }

  type Game {
    href: String
    subtypes: [String]
    yearpublished: String
    releasestatus: String
    minplayers: String
    maxplayers: String
    minplaytime: String
    maxplaytime: String
    minage: String
    links: Links
    primaryname: Name
    dynamicinfo: Info
  }

  type Links {
    boardgamedesigner: [Designer]
    boardgamepublisher: [Publisher]
    reimplements: [BaseGame]
    boardgamefamily: [GameFamily]
  }

  type Designer {
    objectid: ID!
    name: String
    canonical_link: String
  }

  type Publisher {
    item: PublisherItem
  }

  type PublisherItem {
    objectid: ID!
    href: String
    primaryname: Name
  }

  type BaseGame {
    objectid: ID!
    name: String
    canonical_link: String
  }

  type GameFamily {
    name: String
    objectid: String
  }

  type Name {
    name: String
    nameid: String
  }

  type Info {
    item: InfoItem
  }
  
  type InfoItem {
    stats: Stats
  }
  
  type Stats {
    avgweight: String
  }

  type PublisherMeta {
    objectid: ID!
    location: String
  }

  type Version {
    item: VersionItem
  }

  type VersionItem {
    releasedate: String
    overridedate: String
    orderurl: String
  }

  type Query {
    entries: [Entry]
    entry(id: ID!): Entry
    location(id: ID!): PublisherMeta
  }
`);

export default schema;
