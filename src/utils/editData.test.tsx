/** @format */

const { extendGame } = require("./editData");

const game = {
  gameid: 722,
  bggid: 416541,
  previewid: 17714,
  title: "Upcake (Multilingual edition)",
  publisher: {
    publisherid: 208,
    bggid: 22,
    name: "Piatnik",
    country: null,
    contacts: null,
  },
  designers: [
    {
      designerid: 21,
      bggid: 398,
      name: "Klaus-Jürgen Wrede",
    },
    {
      designerid: 36,
      bggid: 314,
      name: "Ralf zur Linde",
    },
  ],
  minplayers: 2,
  maxplayers: 4,
  minplaytime: 15,
  maxplaytime: 20,
  complexity: 0,
  minage: 8,
  location: "5-E211",
  yearpublished: 2024,
  decision: "none",
  negotiation: "none",
  acquisition: "none",
  numhave: 0,
  numneed: 0,
  numpromise: 0,
};

test("extend database game data with bgg preview data", () => {
  const extendedGame = extendGame(game);
  const additionalData = {
    msrp: 11,
    showprice: 0,
    msrp_currency: "EUR",
    showprice_currency: "USD",
    availability_status: "forsale",
    thumbs: 3,
    releasedate: "10-01-2024",
    releasestatus: "unreleased",
    musthave_stats: 4,
    interested_stats: 22,
    undecided_stats: 35,
    subtypes: ["boardgame"],
    reimplements: [],
    digitized: [
      {
        objectid: "22184",
        name: "Admin: Upcoming Releases",
      },
      {
        objectid: "41222",
        name: "Mechanism: Roll-and-Write",
      },
    ],
    mechanics: [
      {
        objectid: "2072",
        name: "Dice Rolling",
      },
      {
        objectid: "2055",
        name: "Paper-and-Pencil",
      },
      {
        objectid: "2870",
        name: "Re-rolling and Locking",
      },
    ],
    expands: [],
  };
  expect(extendedGame).toEqual({
    ...game,
    ...additionalData,
  });
});
