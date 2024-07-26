/** @format */

export declare global {
  type User = {
    userid: number;
    username: string;
    password: string;
    email?: string;
    comments?: UserComment[];
    rankings?: UserRanking[];
    interest?: Game[];
  };

  type UserComment = {
    commentid: number;
    userid: number;
    gameid: number;
    comment?: string;
  };

  type UserRanking = {
    rankingid: number;
    userid: number;
    gameid: number;
    ranking: number;
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
    contact?: string;
    decision?: Decision;
    negotiation?: Negotiation;
    acquisition?: Acquisition;
    comments?: UserComment[] | [];
    rankings?: UserRanking[] | [];
    interest?: User[] | [];
    // fields from BGG Data
    game_link: string;
    publisher_link: string;
    location: string;
    msrp?: number;
    showprice?: number;
    msrp_currency?: string;
    showprice_currency?: string;
    availability_status?: string;
    thumbs?: number;
    subtypes: string[] | [];
    yearpublished?: string;
    releasedate: string | undefined;
    releasestatus: string | null;
    minage?: string;
    mechanics: GameMeta[] | [];
    expands: GameLink[] | [];
    reimplements: GameLink[] | [];
    digitized: GameMeta[] | [];
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
    contact?: string;
    decision?: Decision;
    negotiation?: Negotiation;
    acquisition?: Acquisition;
    comments?: UserComment[];
    rankings?: UserRanking[];
    interest?: User[];
    itemid?: number;
  };

  enum Decision {
    none = "None",
    rejected = "Rejected",
    evaluate = "Evaluate",
    alternate = "Alternate",
    selected = "Selected",
    soft_locked = "Soft-Locked",
    placed = "Placed",
  }

  enum Negotiation {
    none = "None",
    emailed = "Emailed",
    promised = "Promised",
    deal = "Deal @ SPIEL",
    rejected = "Rejected",
  }

  enum Acquisition {
    none = "None",
    acquired = "Acquired",
    shipping = "Shipping",
    pickup = "SPIEL Pickup",
    dropoff = "PAX Dropoff",
  }

  type UserInput = {
    username: string;
    password: string;
    email: string;
    created_at: string;
    updated_at: string;
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
}
