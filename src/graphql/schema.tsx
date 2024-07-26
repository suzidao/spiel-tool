/** @format */

import { buildSchema } from "graphql";

const schema = buildSchema(`
  type User {
    userid: Int
    username: String
    password: String
    email: String
    comments: [Comment]
    rankings: [Ranking]
    interest: [Game]
  }

  type Comment {
    commentid: Int
    userid: Int
    gameid: Int
    comment: String
  }

  type Ranking {
    rankingid: Int
    userid: Int
    gameid: Int
    ranking: Int
  }

  type Game {
    gameid: Int
    title: String
    publisher: String
    designers: [GameLink]
    minplayers: String
    maxplayers: String
    minplaytime: String
    maxplaytime: String
    complexity: Float
    contact: String
    decision: Decision
    negotiation: Negotiation
    acquisition: Acquisition
    comments: [Comment]
    rankings: [Ranking]
    numhave: Int
    numneed: Int
    itemid: Int
  }

  enum Decision {
    none
    rejected
    evaluate
    alternate
    selected
    soft_locked
    placed
  }

  enum Negotiation {
    none
    emailed
    promised
    deal
    rejected
  }

  enum Acquisition {
    none
    acquired
    shipping
    pickup
    dropoff
  }

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
    item: EntryGame
  }

  type EntryGame {
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

  input UserInput {
    username: String
    password: String
    email: String
  }

  type Query {
    games: [Game]
    game(id: Int): Game
    users: [User]
    user(id: Int): User
    entries: [Entry]
    entry(id: String): Entry
  }

  type Mutation {
    addUser(input: UserInput): User!
  }

`);

export default schema;
