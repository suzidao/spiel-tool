/** @format */

import gamesData from "../data/spiel-preview-games.json";
import pubMetaData from "../data/spiel-preview-parents.json";

export function editGame(game: any, isBGG: boolean | false) {
  const bggData = gamesData as Entry[];
  const pubMeta = pubMetaData as PublisherMeta[];

  const entry = bggData.find((entry: Entry) => entry.itemid === game.itemid?.toString());

  if (isBGG && !!entry) {
    const matchingMeta = pubMeta.find(
      (meta: PublisherMeta) => meta.objectid === entry.publishers[0].item.objectid.toString()
    );
    const retrievedLocation = matchingMeta
      ? matchingMeta.location === null || matchingMeta.location === ""
        ? "–"
        : matchingMeta.location
      : "–";

    const releasedate = entry.version.item.releasedate;
    const overridedate = entry.version.item.overridedate;

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
      }
    };

    const editedGame: CombinedGame = {
      gameid: game.gameid,
      title: entry.version.item.name,
      publisher: entry.publishers[0].item.primaryname.name,
      designers: entry.geekitem.item.links.boardgamedesigner,
      minplayers: entry.geekitem.item.minplayers,
      maxplayers: entry.geekitem.item.maxplayers,
      minplaytime: entry.geekitem.item.minplaytime,
      maxplaytime: entry.geekitem.item.maxplaytime,
      complexity: Number(entry.geekitem.item.dynamicinfo.item.stats.avgweight).toFixed(2),
      game_link: `https://boardgamegeek.com${entry.geekitem.item.href}`,
      publisher_link: `https://boardgamegeek.com${entry.publishers[0].item.href}`,
      location: retrievedLocation,
      msrp: entry.msrp,
      showprice: entry.showprice,
      msrp_currency: entry.msrp_currency,
      showprice_currency: entry.showprice_currency,
      availability_status: entry.availability_status,
      thumbs: entry.reactions.thumbs,
      subtypes: entry.geekitem.item.subtypes,
      yearpublished: entry.geekitem.item.yearpublished,
      releasedate: formattedReleaseDate(),
      releasestatus: entry.version.item.releasestatus,
      minage: entry.geekitem.item.minage,
      mechanics: entry.geekitem.item.links.boardgamemechanic,
      expands: entry.geekitem.item.links.expandsboardgame,
      reimplements: entry.geekitem.item.links.reimplements,
      digitized: entry.geekitem.item.links.boardgamefamily,
    };

    return editedGame;
  } else {
    const parsedContacts = game.contacts ? JSON.parse(game.contacts) : [];
    const formattedDesigners = game.designers
      ? game.designers.map((designer: string) => {
          return {
            name: designer,
          };
        })
      : [];

    const editedGame: CombinedGame = {
      gameid: game.gameid,
      title: game.title,
      publisher: game.publisher,
      designers: formattedDesigners,
      minplayers: game.minplayers,
      maxplayers: game.maxplayers,
      minplaytime: game.minplaytime,
      maxplaytime: game.maxplaytime,
      complexity: game.complexity,
      contacts: parsedContacts,
      location: "–",
      availability_status: null,
      releasedate: "–",
      thumbs: 0,
      yearpublished: "0",
    };

    return editedGame;
  }
}
