/** @format */

"use client";

import { normalizeText } from "@/utils/editData";
import { useEffect, useState } from "react";

type DataObject = {
  id: any;
  name: string;
};

export default function AutoCompleteInput(props: {
  dataList: DataObject[];
  value: string | "";
  name: string;
  onSelect: (name: string, value: string, valueId?: number) => void;
}) {
  const { name, value, dataList, onSelect } = props;
  const [searchTerm, setSearchTerm] = useState<string>(value);
  const [results, setResults] = useState<DataObject[]>([]);
  const [match, setMatch] = useState<number>();

  useEffect(() => {
    onSelect(name, searchTerm, match);
  }, [match, searchTerm]);

  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let term = e.target.value;
    setSearchTerm(term);
    search(term);
  };

  const search = (term: string) => {
    const filteredResults = dataList.filter((result) => {
      return normalizeText(result.name).includes(normalizeText(term));
    });

    term !== "" ? setResults(filteredResults) : setResults([]);
  };

  return (
    <div className="relative">
      <input type="text" name={name} value={searchTerm} onChange={handleChange} />
      <div className="absolute z-10">
        <div className="flex flex-col max-w-60 border-zinc-600 bg-white z-10">
          {results.map((match: DataObject, idx: number) => (
            <button
              key={idx}
              className="text-left bg-zinc-200 px-4 py-2"
              onClick={() => {
                setSearchTerm(match.name);
                setResults([]);
                setMatch(match.id);
              }}
            >
              {match.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
