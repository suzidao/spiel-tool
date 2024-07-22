/** @format */

import { buildSchema } from "graphql";

const schema = buildSchema(`
  type Entry {
    objectid: String!
    itemid: String
    versionid: String
    geekitem: GeekItem!
    version: Version
    msrp: Float
    showprice: Float
    msrp_currency: String
    showprice_currency: String
    location: String
    availability_status: String
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
    boardgamedesigner: [GameLink]
    boardgamepublisher: [Publisher]
    reimplements: [GameLink]
    boardgamefamily: [GameMeta]
    boardgamecategory: [GameMeta]
    boardgameversion: [GameMeta]
    boardgamemechanic: [GameMeta]
    expandsboardgame: [GameLink]
  }

  type Publisher {
    item: PublisherItem
  }

  type PublisherItem {
    objectid: String
    href: String
    primaryname: Name
  }

  type GameLink {
    objectid: String
    name: String
    canonical_link: String
  }

  type GameMeta {
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
    objectid: String
    location: String
  }

  type Version {
    item: VersionItem
  }
    
  type VersionItem {
    objectid: String
    name: String
    releasedate: String
    overridedate: String
    releasestatus: String
    orderurl: String
  }

  type Query {
    entries: [Entry]
    entry(id: String): Entry
  }
`);

export default schema;
