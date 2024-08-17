/** @format */

"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getGameMetadata } from "./actions";

type GameMetadataContext = {
  publishers: Publisher[];
  designers: Designer[];
};

export const GameMetadataContext = createContext<GameMetadataContext | null>(null);

export function GameMetadataContextProvider({ children }: { children: any }) {
  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [designers, setDesigners] = useState<Designer[]>([]);

  useEffect(() => {
    getGameMetadata().then((res) => {
      setPublishers(res.publishers);
      setDesigners(res.designers);
    });
  }, []);

  return <GameMetadataContext.Provider value={{ publishers, designers }}>{children}</GameMetadataContext.Provider>;
}

export function useGameMetadataContext() {
  const context = useContext(GameMetadataContext);

  if (!context) {
    throw new Error("useGameMetadataContext must be used within a GameMetadataContextProvider");
  }

  return context;
}
