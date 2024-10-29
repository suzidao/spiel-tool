/** @format */

import { GameMetadataContextProvider } from "@/app/contexts";

export default function GamesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <GameMetadataContextProvider>{children}</GameMetadataContextProvider>
    </div>
  );
}
