/** @format */
"use client";

import { useEffect, useState } from "react";
import { getGames } from "../../actions";
import bggData from "../../../data/spiel-preview-games.json";
import Button from "@/app/components/Button";
import { normalizeText } from "@/utils/editData";
import Link from "next/link";

export default function ReconciliationPage() {
  const [existingBGGgames, setExistingBGGgames] = useState<Game[]>([]);
  [];
  [];
  const [matchTerm, setMatchTerm] = useState<string>("");
  const [results, setResults] = useState<Game[]>([]);
  const [gameMatch, setGameMatch] = useState<ImportedBGGData>();

  useEffect(() => {
    getGames().then((res) => {
      setExistingBGGgames(res);
    });
  }, [gameMatch]);

  const importedBGGGames = bggData as ImportedBGGData[];

  const existingPreviewIds = existingBGGgames ? existingBGGgames.map((game: Game) => game.previewid) : [];

  const newBGGgames = existingPreviewIds
    ? importedBGGGames.filter((bggGame: ImportedBGGData) => !existingPreviewIds.includes(Number(bggGame.itemid)))
    : importedBGGGames;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let term = e.target.value;
    setMatchTerm(term);
    match(term);
  };

  const match = (term: string) => {
    const filteredResults = existingBGGgames.filter((game) => {
      return normalizeText(game.title).includes(normalizeText(term));
    });

    term !== "" ? setResults(filteredResults) : setResults([]);
  };

  return (
    <div className="flex flex-row p-12 gap-12">
      <div className="flex flex-col gap-4 items-center w-1/2">
        <div className="text-lg">BGG Data</div>

        {newBGGgames.length > 0 && (
          <table className="mt-4">
            <thead>
              <tr>
                <th>Title</th>
                <th>Publisher</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {newBGGgames.map((game) => (
                <tr key={game.itemid} className="border-b border-gray-400">
                  <td className={game.itemid === gameMatch?.itemid ? "font-semibold p-2" : "p-2"}>
                    {game.geekitem.item.primaryname.name}
                  </td>
                  <td className={game.itemid === gameMatch?.itemid ? "font-semibold p-2" : "p-2"}>
                    {game.publishers[0].item.primaryname.name}
                  </td>
                  <td className="p-2">
                    <Button
                      btnAction={() => {
                        setMatchTerm(game.geekitem.item.primaryname.name);
                        match(game.geekitem.item.primaryname.name);
                        setGameMatch(game);
                      }}
                      btnColor="teal"
                      btnText="Reconcile"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div className="flex flex-col gap-2 w-1/2 sticky top-0 self-start pt-8">
        <p className="flex gap-2 justify-start items-center">
          Currently matching: <strong>{gameMatch?.geekitem.item.primaryname.name}</strong>
          {!!gameMatch && (
            <button
              className="ml-4 font-black text-red-600"
              onClick={() => {
                setGameMatch(undefined);
                setMatchTerm("");
                setResults([]);
              }}
            >
              x
            </button>
          )}
        </p>
        <input className="my-4" type="text" name="match" value={matchTerm} size={60} onChange={handleChange} />
        {!!gameMatch && (
          <>
            {results.length > 0 && (
              <table>
                <thead>
                  <tr>
                    <th className="px-3">Select</th>
                    <th className="px-3">Title</th>
                    <th className="px-3">Publisher</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((match: Game) => (
                    <tr key={match.gameid} className="border-b border-gray-400">
                      <td className="p-3">
                        <Link href={`/games/${match.gameid}/reconcile?previewid=${gameMatch.itemid}`}>
                          <Button btnText="Match" btnColor="cyan" />
                        </Link>
                      </td>
                      <td className="p-3">{match.title}</td>
                      <td className="p-3">{match.publisher.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <div className="py-2">
              <span className="pr-8">{results.length > 0 ? "No Viable Matches" : "No Matches Found"}</span>
              <Link href={`/games/add?previewid=${gameMatch.itemid}`}>
                <Button btnText="Add Game" btnColor="green" />
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
