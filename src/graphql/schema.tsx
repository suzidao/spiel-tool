/** @format */

import { buildSchema } from "graphql";

export const schema = buildSchema(`
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

  type Publisher {
    publisherid: Int
    bggid: Int
    name: String
    country: String
    contacts: String
  }

  type Designer {
    designerid: Int
    bggid: Int
    name: String
  }

  type Game {
    gameid: Int
    bggid: Int
    previewid: Int
    title: String
    publisher: Publisher
    designers: [Designer]
    minplayers: Int
    maxplayers: Int
    minplaytime: Int
    maxplaytime: Int
    complexity: Float
    minage: Int
    yearpublished: Int
    location: String
    decision: Decision
    negotiation: Negotiation
    acquisition: Acquisition
    comments: [Comment]
    rankings: [Ranking]
    interest: [User]
    numhave: Int
    numneed: Int
    numpromise: Int
    eventid: Int
    paxid: Int
  }

  type DesignerGame {
    id: Int
    gameid: Int
    designerid: Int
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
    purchased
    pickup
    dropoff
  }

  input UserInput {
    username: String
    password: String
    email: String
  }

  input GameInput {
    bggid: Int
    previewid: Int
    title: String
    publisherid: Int
    designers: [Int]
    minplayers: Int
    maxplayers: Int
    minplaytime: Int
    maxplaytime: Int
    complexity: Float
    minage: Int
    yearpublished: Int
    decision: Decision
    negotiation: Negotiation
    acquisition: Acquisition
    numhave: Int
    numneed: Int
    numpromise: Int
  }

  input CommentInput {
    commentid: Int
    userid: Int
    gameid: Int
    comment: String
  }

  input RankingInput {
    rankingid: Int
    userid: Int
    gameid: Int
    ranking: Int
  }

  input PublisherInput {
    bggid: Int
    name: String
    country: String
    contacts: String
  }

  input DesignerInput {
    bggid: Int
    name: String
  }

  input DesignerGameInput {
    id: Int
    gameid: Int
    designerid: Int
  }

  type Query {
    games: [Game]
    game(id: Int): Game
    publishers: [Publisher]
    publisher(id: Int): Publisher
    designers: [Designer]
    designer(id: Int): Designer
    users: [User]
    user(id: Int): User
  }

  type Mutation {
    addGame(input: GameInput): Game!
    addPublisher(input: PublisherInput): Publisher!
    addDesigner(input: DesignerInput): Designer!
    addUser(input: UserInput): User!
    addBGGData: [Game]
  }

`);
