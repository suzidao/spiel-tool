/** @format */

import Link from "next/link";
import { Fragment } from "react";
import BGGKeys from "../../data/bgg-keys.json";

export default function GameInfo(props: { game: Entry }) {
  const { game } = props;
  const { primaryname, href, links, minplayers, maxplayers, minplaytime, maxplaytime, dynamicinfo } =
    game.geekitem.item;
  const publisher = game.publishers[0].item;

  return (
    <div>
      <div>
        <span>Game Title</span>
        <Link href={`https://boardgamegeek.com${href}`} target="_blank">
          {primaryname.name}
        </Link>
      </div>
      <div>
        <span>Publisher</span>
        <Link key={publisher.objectid} href={`https://boardgamegeek.com${publisher.href}`} target="_blank">
          {publisher.primaryname.name}
        </Link>
      </div>
      <div>
        <span>Designer(s)</span>
        {links.boardgamedesigner.map((designer: Designer, idx: number) => {
          const isLast = links.boardgamedesigner.length - 1 === idx;
          return (
            <Fragment key={designer.objectid}>
              <Link href={designer.canonical_link} target="_blank">
                {designer.name}
              </Link>
              {!isLast && ", "}
            </Fragment>
          );
        })}
      </div>
      <div>
        <span>Location</span>
        {game.location}
      </div>
      <div>
        <span>Thumbs</span>
        {game.reactions.thumbs}
      </div>
      <div>
        <span>Release Date</span>
        {game.version.item.releasedate}
      </div>
      <div>
        <span>Player Count</span>
        {minplayers} – {maxplayers} players
      </div>
      <div>
        <span>Playtime</span>
        {minplaytime} – {maxplaytime} minutes
      </div>
      <div>
        <span>Complexity</span>
        {dynamicinfo.item.stats.avgweight}
      </div>
      <div>
        <span>Mechanics</span>
      </div>
      <div>
        <span>Digital Implementations</span>
        {links.boardgamefamily.map((family) => {
          const keys = Object.keys(BGGKeys.digital_implementations);

          if (keys.includes(family.objectid)) {
            return BGGKeys.digital_implementations.filter((key) => {
              return key.objectid === family.objectid ? key.name : "";
            });
          }
        })}
      </div>
    </div>
  );
}
