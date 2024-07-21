/** @format */

export declare global {
  type Entry = {
    itemid: string;
    objectid: string;
    geekitem: GeekItem;
    msrp: number;
    showprice: number;
    location: string | null;
    pretty_availability_status: string;
    reactions: Reactions;
    version: Version;
    publishers: Publisher[];
  };

  type Reactions = {
    thumbs: number;
  };

  type GeekItem = {
    item: Game;
  };

  type Version = {
    item: VersionItem;
  };

  type VersionItem = {
    releasedate: string | undefined;
    overridedate: string;
  };

  type Game = {
    href: string;
    subtypes: string[];
    yearpublished: string;
    releasestatus: string | null;
    minplayers: string;
    maxplayers: string;
    minplaytime: string;
    maxplaytime: string;
    minage: string;
    links: Links;
    primaryname: Name;
    dynamicinfo: Info;
  };

  type Links = {
    boardgamedesigner: Designer[];
    reimplements: BaseGame[];
    boardgamefamily: GameFamily[];
    boardgamemechanic: GameMechanic[];
    boardgamecategory: GameCategory[];
    boardgameversion: GameVersion[];
  };

  type Designer = {
    objectid: string;
    name: string;
    canonical_link: string;
  };

  type Publisher = {
    item: {
      objectid: string;
      href: string;
      primaryname: {
        name: string;
      };
    };
  };

  type BaseGame = {
    objectid: string;
    name: string;
    canonical_link: string;
  };

  type GameFamily = {
    objectid: string;
    name: string;
  };

  type GameMechanic = {
    objectid: string;
    name: string;
  };

  type GameCategory = {
    objectid: string;
    name: string;
  };

  type GameVersion = {
    objectid: string;
    name: string;
  };

  type Name = {
    name: string;
    nameid: string;
  };

  type Info = {
    item: InfoItem;
  };

  type InfoItem = {
    stats: Stats;
  };

  type Stats = {
    avgweight: string;
  };

  type PublisherMeta = {
    objectid: string;
    location: string | null;
  };
}
