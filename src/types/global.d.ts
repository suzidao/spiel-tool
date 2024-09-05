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

  type UserInput = {
    username: string;
    password: string;
    email: string;
  };

  type Comment = {
    commentid: number;
    userid: number;
    gameid: number;
    comment?: string;
    created_at: string;
    updated_at: string;
  };

  type CommentInput = {
    commentid: number;
    userid: number;
    gameid: number;
    comment?: string;
  };

  type Ranking = {
    rankingid: number;
    userid: number;
    gameid: number;
    ranking: number;
    created_at: string;
    updated_at: string;
  };

  type RankingInput = {
    rankingid: number;
    userid: number;
    gameid: number;
    ranking: number;
  };

  type Publisher = {
    publisherid: number;
    bggid: number;
    name: string;
    country: string | null;
    contacts: string | null;
  };

  type PublisherInput = {
    bggid: number | null;
    name: string;
    country: string | null;
    contacts: string | null;
  };

  type Contact = {
    name: string;
    email: string;
  };

  type Designer = {
    designerid: number;
    bggid: number;
    name: string;
  };

  type DesignerInput = {
    bggid: number;
    name: string;
  };

  type BaseGameData = {
    gameid: number;
    title: string;
    publisher: Publisher;
    designers: Designer[];
    minplayers: number;
    maxplayers: number;
    minplaytime: number;
    maxplaytime: number;
    complexity: number;
    minage: number;
    location?: string;
    yearpublished?: number;
  };

  interface DatabaseData extends BaseGameData {
    bggid?: number;
    previewid?: number;
    spielid?: number;
    decision: Decision;
    negotiation: Negotiation;
    acquisition: Acquisition;
    numneed: number;
    numhave: number;
    numpromise: number;
  }

  interface BGGData extends BaseGameData {
    msrp: number;
    showprice: number;
    msrp_currency: string;
    showprice_currency: string;
    availability_status: string | null;
    thumbs: number;
    releasedate: string;
    releasestatus: string;
    musthave_stats: number;
    interested_stats: number;
    undecided_stats: number;
    combined_stats: number;
    subtypes: string[];
    reimplements: GameMeta[];
    digitized: GameMeta[];
    mechanics: GameMeta[];
    expands: GameMeta[];
  }

  interface SpielData extends BaseGameData {
    mechanics?: string[];
    price?: number;
  }

  type Game = DatabaseData & BGGData;

  type GameInput = {
    bggid?: number;
    previewid?: number;
    title: string;
    publisher: number | null;
    designers: number[];
    minplayers?: number;
    maxplayers?: number;
    minplaytime?: number;
    maxplaytime?: number;
    complexity?: number;
    minage?: number;
    location?: string;
    yearpublished?: number;
    decision?: Decision;
    negotiation?: Negotiation;
    acquisition?: Acquisition;
    numneed?: number;
    numhave?: number;
    numpromise?: number;
  };

  type GameDesigner = {
    id: Int;
    gameid: Int;
    designerid: Int;
  };

  type GameDesignerInput = {
    gameid: Int;
    designerid: Int;
  };

  type ImportedBGGData = {
    objectid: string;
    itemid: string;
    msrp: number;
    showprice: number;
    msrp_currency: string;
    showprice_currency: string;
    location: string;
    availability_status: string;
    reactions: {
      thumbs: number;
    };
    version: {
      item: {
        objectid: number;
        name: string;
        releasedate: string;
        overridedate: string;
        releasestatus: string;
      };
    };
    publishers: {
      item: {
        objectid: number;
        primaryname: {
          name: string;
        };
      };
    }[];
    stats: {
      musthave: number;
      interested: number;
      undecided: number;
    };
    geekitem: {
      item: {
        subtypes: string[];
        yearpublished: string;
        minplayers: string;
        maxplayers: string;
        minplaytime: string;
        maxplaytime: string;
        minage: string;
        links: {
          boardgamedesigner: GameMeta[];
          reimplements: GameMeta[];
          boardgamefamily: GameMeta[];
          boardgamemechanic: GameMeta[];
          expandsboardgame: GameMeta[];
        };
        primaryname: {
          name: string;
        };
        dynamicinfo: {
          item: {
            stats: {
              avgweight?: string;
            };
          };
        };
      };
    };
  };

  type GameMeta = {
    objectid: string;
    name: string;
  };

  type PublisherMeta = {
    objectid: string;
    location: string;
  };

  type ImportedSPIELData = {
    INFO: string; // contains designer info
    S_ORDER: string; // sorting order
    TITEL: string; // game title
    FIRMA_ID: string; // publisher id
    UNTERTITEL: string; // publisher name
    THEMEN: string[]; // categories, mechanics, subtypes
    STAENDE: {
      // locations
      ID: string;
      HALLE: string;
      NAME: string;
    }[];
  };

  type SPIELTheme = {
    ID: string;
    TITEL: string;
    S_ORDER: string;
    PARENT_ID: string;
  };

  type SPIELGame = {
    spielid: number;
    gameid?: number;
    title: string;
    publisher: string;
    designers: string[];
    minplayers: number;
    maxplayers: number;
    playtime: number; // import as minplaytime
    minage: number;
    complexity: number;
    location: string;
    price: number; // extended data
    releasedate: string; // extract year for yearpublished
    mechanics?: string[];
    categories?: string[];
    subtypes?: string[]; // set to ignore if "expansion" exists
    ignore: boolean;
  };

  type SPIELInput = {
    title: string;
    publisher: string;
    designers: string;
    minplayers: number;
    maxplayers: number;
    playtime: number;
    minage: number;
    complexity?: number;
    price?: number;
    location: string;
    releasedate: string;
    mechanics?: string;
    categories?: string;
    subtypes?: string;
    ignore: boolean;
  };
}
