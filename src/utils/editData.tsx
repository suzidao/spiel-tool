/** @format */

import gamesData from "../data/spiel-preview-games.json";
import pubMetaData from "../data/spiel-preview-parents.json";

const bggData = gamesData as ImportedBGGData[];
const pubMeta = pubMetaData as PublisherMeta[];

export function normalizeText(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function editLocation(data: ImportedBGGData) {
  const matchingMeta = pubMeta.find(
    (meta: PublisherMeta) => Number(meta.objectid) === data.publishers[0].item.objectid
  );

  return matchingMeta
    ? matchingMeta.location === null || matchingMeta.location === ""
      ? "–"
      : matchingMeta.location
    : "–";
}

export function formatPlayerCount(minplayers?: number, maxplayers?: number) {
  switch (!!minplayers || !!maxplayers) {
    case minplayers === maxplayers:
    case !!minplayers && !maxplayers:
      return minplayers;
    case !minplayers && !!maxplayers:
      return maxplayers;
    default:
      return `${minplayers} – ${maxplayers}`;
  }
}

export function formatPlayTime(minplaytime?: number, maxplaytime?: number) {
  switch (!!minplaytime || !!maxplaytime) {
    case minplaytime === maxplaytime:
    case !!minplaytime && !maxplaytime:
      return minplaytime;
    case !minplaytime && !!maxplaytime:
      return maxplaytime;
    default:
      return `${minplaytime} – ${maxplaytime}`;
  }
}

export function formatBGGGame(game: ImportedBGGData): GameInput {
  const hasComplexity = !!game.geekitem.item.dynamicinfo.item.stats.avgweight;

  return {
    bggid: Number(game.objectid),
    previewid: Number(game.itemid),
    title: game.version.item.name,
    publisher: null,
    designers: [],
    minplayers: Number(game.geekitem.item.minplayers),
    maxplayers: Number(game.geekitem.item.maxplayers),
    minplaytime: Number(game.geekitem.item.minplaytime),
    maxplaytime: Number(game.geekitem.item.maxplaytime),
    minage: Number(game.geekitem.item.minage),
    complexity: hasComplexity
      ? Number(Number(game.geekitem.item.dynamicinfo.item.stats.avgweight).toFixed(2))
      : undefined,
    location: editLocation(game),
    yearpublished: Number(game.geekitem.item.yearpublished),
    decision: "none",
    negotiation: "none",
    acquisition: "none",
    numhave: 0,
    numneed: 0,
    numpromise: 0,
    notes: undefined,
  };
}

export function extendGame(game: DatabaseData) {
  const data = bggData.find((data: ImportedBGGData) => Number(data.itemid) === game.previewid);

  if (!!data) {
    const releasedate = data.version.item.releasedate;
    const overridedate = data.version.item.overridedate;

    const formattedReleaseDate = () => {
      if (overridedate) {
        return overridedate;
      } else if (releasedate) {
        let splitDate = releasedate.split("-");
        let [year, month, day] = splitDate;

        if (releasedate === "0000-00-00") {
          return "–";
        } else if (releasedate.endsWith("-00-00")) {
          return year;
        } else if (releasedate.endsWith("-00")) {
          return month + "-" + year;
        } else if (splitDate.length > 2 && splitDate[0].length === 4) {
          return month + "-" + day + "-" + year;
        } else {
          return releasedate;
        }
      } else {
        return "–";
      }
    };

    const extendedGame: BGGData = {
      ...game,
      location: game.location ?? editLocation(data),
      msrp: data.msrp,
      showprice: data.showprice,
      msrp_currency: data.msrp_currency,
      showprice_currency: data.showprice_currency,
      availability_status: data.availability_status,
      thumbs: data.reactions.thumbs,
      musthave_stats: data.stats.musthave,
      interested_stats: data.stats.interested,
      undecided_stats: data.stats.undecided,
      combined_stats: data.stats.musthave + data.stats.interested + data.stats.undecided,
      subtypes: data.geekitem.item.subtypes,
      releasedate: formattedReleaseDate(),
      releasestatus: data.version.item.releasestatus,
      mechanics: data.geekitem.item.links.boardgamemechanic.map((mechanic) => {
        return { objectid: mechanic.objectid, name: mechanic.name };
      }),
      expands: data.geekitem.item.links.expandsboardgame.map((expansion) => {
        return { objectid: expansion.objectid, name: expansion.name };
      }),
      reimplements: data.geekitem.item.links.reimplements.map((reimplementation) => {
        return { objectid: reimplementation.objectid, name: reimplementation.name };
      }),
      digitized: data.geekitem.item.links.boardgamefamily.map((family) => {
        return { objectid: family.objectid, name: family.name };
      }),
    };

    return extendedGame as Game;
  } else {
    return {
      ...game,
      msrp: 0,
      showprice: 0,
      thumbs: 0,
      musthave_stats: 0,
      interested_stats: 0,
      undecided_stats: 0,
      combined_stats: 0,
      releasedate: "–",
      location: game.location ?? "–",
    } as Game;
  }
}
