/** @format */

export declare global {
  type Entry = {
    itemid: string;
    objectid: string;
    geekitem: GeekItem;
    msrp: number;
    showprice: number;
    location: string;
    pretty_availability_status: string;
    reactions: Reactions;
    version: Version;
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
    releasedate: string;
    overridedate: string;
  };

  type Game = {
    href: string;
    subtypes: string[];
    yearpublished: string;
    minplayers: string;
    maxplayers: string;
    minplaytime: string;
    maxplaytime: string;
    minage: string;
    links: Links;
    primaryname: string;
    dynamicinfo: Info;
  };

  type Links = {
    boardgamedesigner: Designer[];
    boardgamepublisher: Publisher[];
    reimplements: BaseGame[];
  };

  type Designer = {
    objectid: string;
    name: string;
    canonical_link: string;
  };

  type Publisher = {
    objectid: string;
    name: string;
    canonical_link: string;
  };

  type BaseGame = {
    objectid: string;
    name: string;
    canonical_link: string;
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
    location: string;
  };
}
