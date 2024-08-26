/** @format */

"use client";

import { useEffect, useState } from "react";
import { assignGame, getAllGames } from "@/app/actions";
import { normalizeText } from "@/utils/editData";

export default function ReconciliationPage() {
  const [dbGames, setDBGames] = useState<Game[]>([]);
  const [SPIELGames, setSPIELGames] = useState<SPIELGame[]>([]);
  const [matchTerm, setMatchTerm] = useState<string>("");
  const [results, setResults] = useState<Game[]>([]);
  const [gameMatch, setGameMatch] = useState<SPIELGame>();

  useEffect(() => {
    getAllGames().then((res) => {
      setSPIELGames(res.SPIELgames);
      setDBGames(res.games);
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let term = e.target.value;
    setMatchTerm(term);
    match(term);
  };

  const match = (term: string) => {
    const filteredResults = dbGames.filter((game) => {
      return normalizeText(game.title).includes(normalizeText(term));
    });

    term !== "" ? setResults(filteredResults) : setResults([]);
  };

  return (
    <div className="flex flex-row gap-4 justify-between">
      <table className="w-1/2">
        <thead>
          <tr>
            <th>Title</th>
            <th>Publisher</th>
            <th>Reconcile</th>
          </tr>
        </thead>
        <tbody>
          {SPIELGames.map((game: SPIELGame) => {
            const { spielid, gameid, title, publisher } = game;
            return (
              <tr key={spielid}>
                <td className="py-2">{title}</td>
                <td className="py-2">{publisher}</td>
                <td className="py-2">
                  {!!gameid ? (
                    "✅"
                  ) : (
                    <button
                      onClick={() => {
                        setMatchTerm(title);
                        match(title);
                        setGameMatch(game);
                      }}
                    >
                      Reconcile
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="w-1/2 fixed right-0 top-0">
        <p>Currenting matching: {gameMatch?.title}</p>
        <input type="text" name="match" value={matchTerm} onChange={handleChange} />
        <table>
          <thead>
            <tr>
              <th>Select</th>
              <th>Title</th>
              <th>Publisher</th>
            </tr>
          </thead>
          <tbody>
            {results.map((match: Game) => (
              <tr>
                <td>
                  <button
                    onClick={() => {
                      assignGame(gameMatch!.spielid, match.gameid);
                    }}
                  >
                    Match
                  </button>
                </td>
                <td>{match.title}</td>
                <td>{match.publisher.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
