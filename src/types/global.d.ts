/** @format */

export declare global {
  type User = {
    userid: number;
    username: string;
    password: string;
    email?: string;
    comments?: Comment[];
    rankings?: Ranking[];
    interest?: Game[];
  };

  type Comment = {
    commentid: number;
    userid: number;
    gameid: number;
    comment?: string;
    created_at: string;
    updated_at: string;
  };

  type Ranking = {
    rankingid: number;
    userid: number;
    gameid: number;
    ranking: number;
    created_at: string;
    updated_at: string;
  };

  type CombinedGame = {
    gameid: number;
    title: string;
    publisher: string;
    designers: GameLink[] | [];
    minplayers: string;
    maxplayers: string;
    minplaytime: string;
    maxplaytime: string;
    complexity: string;
    contacts?: Contact[] | [];
    decision?: Decision;
    negotiation?: Negotiation;
    acquisition?: Acquisition;
    comments?: Comment[] | [];
    rankings?: Ranking[] | [];
    interest?: number[] | [];
    // fields from BGG Data
    game_link?: string | null;
    publisher_link?: string | null;
    location?: string | null;
    msrp?: number | null;
    showprice?: number | null;
    msrp_currency?: string | null;
    showprice_currency?: string | null;
    availability_status?: string | null;
    thumbs?: number | null;
    subtypes?: string[] | [];
    yearpublished?: string | null;
    releasedate?: string | undefined;
    releasestatus?: string | null;
    minage?: string | null;
    mechanics?: GameMeta[] | [];
    expands?: GameLink[] | [];
    reimplements?: GameLink[] | [];
    digitized?: GameMeta[] | [];
  };

  type Game = {
    gameid: number;
    title?: string;
    publisher?: string;
    designers?: string[];
    minplayers?: number;
    maxplayers?: number;
    minplaytime?: number;
    maxplaytime?: number;
    complexity?: number;
    contacts?: Contact[] | [];
    decision?: Decision;
    negotiation?: Negotiation;
    acquisition?: Acquisition;
    numneed?: number;
    numhave?: number;
    numpromise?: number;
    comments?: Comment[];
    rankings?: Ranking[];
    interest?: number[];
    itemid?: number;
  };

  type UserInput = {
    username: string;
    password: string;
    email: string;
  };

  type GameInput = {
    title: string;
    publisher?: string;
    designers?: string[];
    minplayers?: number;
    maxplayers?: number;
    minplaytime?: number;
    maxplaytime?: number;
    complexity?: number;
    contacts?: ContactInput[];
    numneed?: number;
    numhave?: number;
    numpromise?: number;
    decision?: Decision;
    negotiation?: Negotiation;
    acquisition?: Acquisition;
    comments?: CommentInput[];
    rankings?: RankingInput[];
    interest?: number[];
  };

  // BGG Data Fields
  type Entry = {
    itemid: string;
    objectid: string;
    versionid: string;
    geekitem: GeekItem;
    msrp: number;
    showprice: number;
    msrp_currency: string;
    showprice_currency: string;
    location: string | null;
    availability_status: string;
    pretty_availability_status: string;
    reactions: Reactions;
    version: Version;
    publishers: Publisher[];
  };

  type Reactions = {
    thumbs: number;
  };

  type GeekItem = {
    item: EntryGame;
  };

  type Version = {
    item: VersionItem;
  };

  type VersionItem = {
    objectid: string;
    name: string;
    releasedate: string | undefined;
    overridedate: string;
    releasestatus: string | null;
  };

  type EntryGame = {
    href: string;
    subtypes: string[];
    yearpublished: string;
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
    boardgamedesigner: GameLink[];
    reimplements: GameLink[];
    boardgamefamily: GameMeta[];
    boardgamemechanic: GameMeta[];
    boardgamecategory: GameMeta[];
    boardgameversion: GameMeta[];
    expandsboardgame: GameLink[];
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

  type GameLink = {
    objectid: string;
    name: string;
    canonical_link: string;
  };

  type GameMeta = {
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

  type Contact = {
    name?: string;
    email?: string;
  };

  type ContactInput = {
    name?: string;
    email?: string;
  };

  type CommentInput = {
    commentid: number;
    userid: number;
    gameid: number;
    comment?: string;
  };

  type RankingInput = {
    rankingid: number;
    userid: number;
    gameid: number;
    ranking: number;
  };
}
