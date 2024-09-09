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
    spielid: Int
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
  
  type SPIELGame {
    spielid: Int
    gameid: Int
    title: String
    publisher: String
    designers: [String]
    minplayers: Int
    maxplayers: Int
    playtime: Int
    minage: Int
    complexity: Int
    price: Float
    location: String
    releasedate: String
    mechanics: [String]
    categories: [String]
    subtypes: [String]
    ignore: Boolean
  }

  type GameDesigner {
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
    purchase
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
    spielid: Int
    previewid: Int
    title: String
    publisher: Int
    designers: [Int]
    minplayers: Int
    maxplayers: Int
    minplaytime: Int
    maxplaytime: Int
    complexity: Float
    minage: Int
    location: String
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

  input GameDesignerInput {
    id: Int
    gameid: Int
    designerid: Int
  }

  input SPIELInput {
    title: String
    publisher: String
    designers: [String]
    minplayers: Int
    maxplayers: Int
    playtime: Int
    minage: Int
    complexity: Int
    price: Float
    location: String
    releasedate: String
    mechanics: [String]
    categories: [String]
    subtypes: [String]
    ignore: Boolean
  }

  type Query {
    games: [Game]
    game(id: Int): Game
    SPIELgames: [SPIELGame]
    SPIELgame(id: Int): SPIELGame
    publishers: [Publisher]
    publisher(id: Int): Publisher
    designers: [Designer]
    designer(id: Int): Designer
    users: [User]
    user(id: Int): User
    gamedesignerjoin: [GameDesigner]
  }

  type Mutation {
    addGame(input: GameInput): Game!
    importSPIELData(input: SPIELInput): SPIELGame!
    addPublisher(input: PublisherInput): Publisher!
    addDesigner(input: DesignerInput): Designer!
    addUser(input: UserInput): User!
    addBGGData: [Game]
    assignGame(spielid: Int, gameid: Int): [Game]
    toggleIgnore(spielid: Int, ignore: Boolean): [SPIELGame]
    editGame(gameid: Int, input: GameInput): Game!
    editPublisher(publisherid: Int, input: PublisherInput): Publisher!
    editDesigner(designerid: Int, input: DesignerInput): Designer!
    cullGame(gameid: Int): Int
    cullPublisher(publisherid: Int): Int
    cullDesigner(designerid: Int): Int
    addSPIELGame(spielid: Int, input: SPIELInput): SPIELGame
  }

`);
