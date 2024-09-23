/** @format */

import * as fs from "fs";
import * as path from "path";

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
  getSPIELGame,
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
  updateStatus,
  updateNote,
  updateAmount,
} from "./queries";

import SPIELThemeData from "../data/spiel-app-themes.json";
import type * as Global from "../types/global.d.ts";
import { formatBGGGame } from "../utils/editData";

const SPIELThemes = SPIELThemeData as SPIELTheme[];

export const resolvers = {
  Query: {
    SPIELgames: () => getSPIELGames(),
    SPIELgame: (_root: any, args: { id: number }) => getSPIELGame(args.id),
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
    spielid: (root: Game) => root.spielid,
    title: (root: Game) => root.title,
    publisher: (root: Game) => getGamePublisher(root.gameid),
    designers: (root: Game) => getGameDesigners(root.gameid),
    minplayers: (root: Game) => root.minplayers,
    maxplayers: (root: Game) => root.maxplayers,
    minplaytime: (root: Game) => root.minplaytime,
    maxplaytime: (root: Game) => root.maxplaytime,
    complexity: (root: Game) => root.complexity,
    minage: (root: Game) => root.minage,
    location: (root: Game) => root.location,
    yearpublished: (root: Game) => root.yearpublished,
    numhave: (root: Game) => root.numhave,
    numneed: (root: Game) => root.numneed,
    numpromise: (root: Game) => root.numpromise,
    notes: (root: Game) => root.notes,
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

    editStatus: async (root: Game, args: { gameid: number; status: string; value: string }) => {
      const { gameid, status, value } = args;

      await updateStatus(gameid, status, value)
        .then((res) => res)
        .catch((error) => console.error(error));
    },

    saveNote: async (root: Game, args: { gameid: number; note: string }) => {
      const { gameid, note } = args;

      await updateNote(gameid, note)
        .then((res) => res)
        .catch((error) => console.error(error));
    },

    setAmount: async (root: Game, args: { gameid: number; numField: string; value: number }) => {
      const { gameid, numField, value } = args;

      await updateAmount(gameid, numField, value)
        .then((res) => res)
        .catch((error) => console.error(error));
    },

    importSPIELData: async () => {
      const dbGames = await getSPIELGames().then((games) => games);
      const existingGameIds = dbGames ? dbGames.map((game) => game.appid) : [];

      const getSPIELData = () => fs.readFileSync(path.join(process.cwd(), "src/data/spiel-app-games.json"), "utf8");

      const SPIELGames = JSON.parse(getSPIELData()) as unknown as ImportedSPIELData[];

      const newGames = SPIELGames.filter((game) => !existingGameIds.includes(Number(game.ID)));

      if (newGames) {
        for (let i = 0; i < newGames.length; i++) {
          const thisGame = newGames[i];

          const playerCount = thisGame.INFO.split("players:</td><td>")[1].split("</td>")[0];

          const booths = !!thisGame.STAENDE
            ? thisGame.STAENDE.map((location) => [location.NAME.slice(0, 1), "-", location.NAME.slice(1)].join(""))
            : [];

          const halls = !!thisGame.STAENDE ? thisGame.STAENDE.map((location) => location.HALLE) : [];

          const pricing = Number(
            Number(thisGame.INFO.split("price:</td><td>")[1].split("</td>")[0].split("&nbsp;")[0]).toFixed(2)
          );

          const level = Number(
            thisGame.THEMEN.filter((theme) => theme.includes("LEVEL"))
              .map((level) => SPIELThemes.find((theme) => theme.ID === level))
              .map((level) => level?.ID.slice(-1))[0]
          );

          const SPIELInput = {
            appid: Number(thisGame.ID),
            title: thisGame.TITEL,
            publisher: thisGame.UNTERTITEL,
            designers: thisGame.INFO.split("</td><td>")[1].split("</td>")[0].toString(),
            minplayers: Number(playerCount.split("-")[0]),
            maxplayers: Number(playerCount.split("-")[1] ?? 0),
            playtime: Number(thisGame.INFO.split("time:</td><td>")[1].split("minutes</td>")[0]),
            minage: Number(thisGame.INFO.split("Age:</td><td>")[1].split("and up</td>")[0]),
            complexity: isNaN(level) ? undefined : level,
            price: isNaN(pricing) ? undefined : pricing,
            location: booths.join(", ") ?? "–",
            halls: halls,
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

      const getBGGData = () => fs.readFileSync(path.join(process.cwd(), "src/data/spiel-preview-games.json"), "utf8");

      const bggGames = JSON.parse(getBGGData()) as unknown as ImportedBGGData[];

      const newGames = bggGames.filter((game) => !previewGameIds.includes(Number(game.itemid)));

      if (newGames.length > 0) {
        // iterate through each new game and add to database
        for (let i = 0; i < newGames.length; i++) {
          // const newGameId = dbGames[dbGames.length - 1].gameid + 1 + i;

          // check existing publishers for game publisher and add if none
          const dbPublishers = await getPublishers().then((publishers) => publishers);

          const bggPublisher = newGames[i].publishers[0].item;
          const bggPublisherId = Number(bggPublisher.objectid);

          const existingPublisher = dbPublishers.find((dbPublisher) => dbPublisher.bggid === bggPublisherId);

          let gamePublisherId;

          if (!existingPublisher) {
            const publisherInput = {
              bggid: bggPublisherId,
              name: bggPublisher.primaryname.name,
              country: null,
              contacts: null,
            };

            await createPublisher(publisherInput)
              .then((res) => {
                gamePublisherId = res.publisherid;
              })
              .catch((error) => console.error(error));
          } else {
            gamePublisherId = existingPublisher.publisherid;
          }

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

          const gameInput = { ...formatBGGGame(thisGame), publisher: gamePublisherId, designers: gameDesignerIds };

          await createGame(gameInput)
            .then((res) => res.gameid)
            .catch((error) => console.error(error));
        }
      }
    },
  },
};
