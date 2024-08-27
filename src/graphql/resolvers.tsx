/** @format */
import {
  getUsers,
  getPublishers,
  getDesigners,
  getGames,
  getSPIELGames,
  getUser,
  getPublisher,
  getDesigner,
  getGame,
  getGamePublisher,
  getGameDesigners,
  createDesigner,
  createGame,
  createSPIELGame,
  createPublisher,
  createUser,
  updateGame,
  updatePublisher,
  updateDesigner,
  deleteGame,
  deletePublisher,
  deleteDesigner,
  getAllGameDesigners,
  associateGames,
  toggleIgnoreSPIELGame,
} from "./queries";

import gamesData from "../data/spiel-preview-games.json";
import SPIELData from "../data/spiel-app-games.json";
import SPIELThemeData from "../data/spiel-app-themes.json";
import type * as Global from "../types/global.d.ts";
import { editLocation } from "../utils/editData";

const bggGames = gamesData as ImportedData[];
const SPIELGames = SPIELData as SPIELProductData[];
const SPIELThemes = SPIELThemeData as SPIELTheme[];

export const resolvers = {
  Query: {
    SPIELgames: () => getSPIELGames(),
    games: () => getGames(),
    game: (_root: any, args: { id: number }) => getGame(args.id),
    publishers: () => getPublishers(),
    publisher: (_root: any, args: { id: number }) => getPublisher(args.id),
    designers: () => getDesigners(),
    designer: (_root: any, args: { id: number }) => getDesigner(args.id),
    users: () => getUsers(),
    user: (_root: any, args: { id: number }) => getUser(args.id),
    gamedesignerjoin: () => getAllGameDesigners(),
  },

  Game: {
    gameid: (root: Game) => root.gameid,
    bggid: (root: Game) => root.bggid,
    previewid: (root: Game) => root.previewid,
    title: (root: Game) => root.title,
    publisher: (root: Game) => getGamePublisher(root.gameid),
    designers: (root: Game) => getGameDesigners(root.gameid),
    minplayers: (root: Game) => root.minplayers,
    maxplayers: (root: Game) => root.maxplayers,
    minplaytime: (root: Game) => root.minplaytime,
    maxplaytime: (root: Game) => root.maxplaytime,
    complexity: (root: Game) => root.complexity,
    minage: (root: Game) => root.minage,
    yearpublished: (root: Game) => root.yearpublished,
    numhave: (root: Game) => root.numhave,
    numneed: (root: Game) => root.numneed,
    numpromise: (root: Game) => root.numpromise,
    decision: (root: Game) => root.decision,
    negotiation: (root: Game) => root.negotiation,
    acquisition: (root: Game) => root.acquisition,
  },

  Publisher: {
    publisherid: (root: Publisher) => root.publisherid,
    bggid: (root: Publisher) => root.bggid,
    name: (root: Publisher) => root.name,
    country: (root: Publisher) => root.country,
    contacts: (root: Publisher) => root.contacts,
  },

  Designer: {
    designerid: (root: Designer) => root.designerid,
    bggid: (root: Designer) => root.bggid,
    name: (root: Designer) => root.name,
  },

  User: {
    userid: (root: User) => root.userid,
    username: (root: User) => root.username,
    email: (root: User) => root.email,
    password: (root: User) => root.password,
  },

  GameDesigner: {
    id: (root: GameDesigner) => root.id,
    designerid: (root: GameDesigner) => root.designerid,
    gameid: (root: GameDesigner) => root.gameid,
  },

  Mutation: {
    addUser: (root: User, args: { input: UserInput }) => createUser(args.input),
    addPublisher: (root: Publisher, args: { input: PublisherInput }) => createPublisher(args.input).then((res) => res),
    addDesigner: (root: Designer, args: { input: DesignerInput }) => createDesigner(args.input).then((res) => res),
    addGame: (root: Game, args: { input: GameInput }) => createGame(args.input).then((res) => res),
    editGame: (root: Game, args: { gameid: number; input: GameInput }) =>
      updateGame(args.gameid, args.input).then((res) => res),
    editPublisher: (root: Publisher, args: { publisherid: number; input: PublisherInput }) =>
      updatePublisher(args.publisherid, args.input),
    editDesigner: (root: Designer, args: { designerid: number; input: DesignerInput }) =>
      updateDesigner(args.designerid, args.input),
    cullGame: (root: Game, args: { gameid: number }) => deleteGame(args.gameid).then((res) => res),
    cullPublisher: (root: Publisher, args: { publisherid: number }) =>
      deletePublisher(args.publisherid).then((res) => res),
    cullDesigner: (root: Designer, args: { designerid: number }) => deleteDesigner(args.designerid).then((res) => res),
    assignGame: (root: Game, args: { spielid: number; gameid: number }) => {
      associateGames(args.spielid, args.gameid);
    },
    toggleIgnore: (root: SPIELGame, args: { spielid: number; ignore: boolean }) =>
      toggleIgnoreSPIELGame(args.spielid, args.ignore).then((res) => res),
    importSPIELData: async () => {
      const dbGames = await getSPIELGames().then((games) => games);
      const existingGames = dbGames
        ? dbGames.map((game) => {
            return { title: game.title, publisher: game.publisher };
          })
        : [];

      const newGames = SPIELGames.filter(
        (game) =>
          !existingGames.find(
            (existingGame) => existingGame.title === game.TITEL && existingGame.publisher === game.UNTERTITEL
          )
      );

      if (newGames) {
        for (let i = 0; i < newGames.length; i++) {
          const thisGame = newGames[i];

          const playerCount = thisGame.INFO.split("players:</td><td>")[1].split("</td>")[0];

          const booths = !!thisGame.STAENDE
            ? thisGame.STAENDE.map((location) => [location.NAME.slice(0, 1), "-", location.NAME.slice(1)].join(""))
            : [];

          const pricing = Number(
            Number(thisGame.INFO.split("price:</td><td>")[1].split("</td>")[0].split("&nbsp;")[0]).toFixed(2)
          );

          const level = Number(
            thisGame.THEMEN.filter((theme) => theme.includes("LEVEL"))
              .map((level) => SPIELThemes.find((theme) => theme.ID === level))
              .map((level) => level?.ID.slice(-1))[0]
          );

          const SPIELInput = {
            title: thisGame.TITEL,
            publisher: thisGame.UNTERTITEL,
            designers: thisGame.INFO.split("</td><td>")[1].split("</td>")[0].toString(),
            minplayers: Number(playerCount.split("-")[0]),
            maxplayers: Number(playerCount.split("-")[1] ?? 0),
            playtime: Number(thisGame.INFO.split("time:</td><td>")[1].split("minutes</td>")[0]),
            minage: Number(thisGame.INFO.split("Age:</td><td>")[1].split("and up</td>")[0]),
            complexity: isNaN(level) ? undefined : level,
            price: isNaN(pricing) ? undefined : pricing,
            location: booths.toString() ?? "–",
            releasedate: thisGame.INFO.split("date:</td><td>")[1].split("</td>")[0],
            mechanics: thisGame.THEMEN.filter((theme) => theme.includes("MECHANISMS") && theme !== "MECHANISMS.23")
              .map((mechanic) => SPIELThemes.find((theme) => theme.ID === mechanic))
              .map((mechanic) => mechanic?.TITEL)
              .toString(),
            categories: thisGame.THEMEN.filter((theme) => theme.includes("CATEGORIES") && theme !== "CATEGORIES.38")
              .map((category) => SPIELThemes.find((theme) => theme.ID === category))
              .map((category) => category?.TITEL)
              .toString(),
            subtypes: thisGame.THEMEN.filter((theme) => theme.includes("TYPE"))
              .map((type) => SPIELThemes.find((theme) => theme.ID === type))
              .map((type) => type?.TITEL)
              .toString(),
            ignore: false,
          };

          createSPIELGame(SPIELInput)
            .then((res) => res)
            .catch((error) => console.error(error));
        }
      }
    },
    addBGGData: async () => {
      const dbGames = await getGames().then((games) => games);
      const previewGameIds = dbGames
        ? dbGames.filter((game) => game.previewid !== null).map((game) => game.previewid)
        : [];

      const newGames = bggGames.filter((game) => !previewGameIds.includes(Number(game.itemid)));

      if (newGames) {
        // iterate through each new game and add to database
        for (let i = 0; i < newGames.length; i++) {
          // const newGameId = dbGames[dbGames.length - 1].gameid + 1 + i;

          // check existing publishers for game publisher and add if none
          const dbPublishers = await getPublishers().then((publishers) => publishers);
          const lastPublisherId = dbPublishers.length > 0 ? dbPublishers[dbPublishers.length - 1].publisherid : 0;

          const bggPublisher = newGames[i].publishers[0].item;
          const bggPublisherId = Number(bggPublisher.objectid);

          const existingPublisher = dbPublishers.find((dbPublisher) => dbPublisher.bggid === bggPublisherId);

          if (!existingPublisher) {
            const publisherInput = {
              bggid: bggPublisherId,
              name: bggPublisher.primaryname.name,
              country: null,
              contacts: null,
            };

            createPublisher(publisherInput)
              .then((res) => res)
              .catch((error) => console.error(error));
          }

          const gamePublisherId = existingPublisher ? existingPublisher.publisherid : lastPublisherId + 1;

          const bggDesigners = newGames[i].geekitem.item.links.boardgamedesigner;

          let gameDesignerIds: number[] = [];

          for (let j = 0; j < bggDesigners.length; j++) {
            const dbDesigners = await getDesigners().then((designers) =>
              designers.length > 0 ? designers.filter((des) => des.bggid !== null) : []
            );

            const bggDesigner = newGames[i].geekitem.item.links.boardgamedesigner[j];
            const bggDesignerId = Number(bggDesigner.objectid);

            const existingDesigner = dbDesigners.find((dbDesigner) => dbDesigner.bggid === bggDesignerId);

            if (!existingDesigner) {
              const designerInput = {
                bggid: bggDesignerId,
                name: bggDesigner.name,
              };

              await createDesigner(designerInput)
                .then((res) => {
                  gameDesignerIds.push(res.designerid);
                })
                .catch((error) => console.error(error));
            } else {
              gameDesignerIds.push(existingDesigner.designerid);
            }
          }

          const thisGame = newGames[i];

          const hasComplexity = !!thisGame.geekitem.item.dynamicinfo.item.stats.avgweight;

          const gameInput = {
            bggid: Number(thisGame.objectid),
            previewid: Number(thisGame.itemid),
            title: thisGame.version.item.name,
            publisher: gamePublisherId,
            designers: gameDesignerIds,
            minplayers: Number(thisGame.geekitem.item.minplayers),
            maxplayers: Number(thisGame.geekitem.item.maxplayers),
            minplaytime: Number(thisGame.geekitem.item.minplaytime),
            maxplaytime: Number(thisGame.geekitem.item.maxplaytime),
            complexity: hasComplexity
              ? Number(Number(thisGame.geekitem.item.dynamicinfo.item.stats.avgweight).toFixed(2))
              : undefined,
            minage: Number(thisGame.geekitem.item.minage),
            location: editLocation(thisGame),
            yearpublished: Number(thisGame.geekitem.item.yearpublished),
            decision: "none",
            negotiation: "none",
            acquisition: "none",
            numhave: 0,
            numneed: 0,
            numpromise: 0,
          };

          createGame(gameInput)
            .then((res) => res)
            .catch((error) => console.error(error));
        }
      }
    },
  },
};
