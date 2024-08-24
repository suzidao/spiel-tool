/** @format */

import SPIELData from "../../../data/spiel-app-games.json";

export default function ReconciliationPage() {
  const SPIELGames = SPIELData.filter((product) => !product.THEMEN.includes("CATEGORIES.32")) as SPIELProductData[];

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Publisher</th>
            <th>Price</th>
            <th>Release Date</th>
            <th>Designer(s)</th>
            <th>Player Count</th>
            <th>Playtime</th>
            <th>Age</th>
            <th>Booth</th>
          </tr>
          {SPIELGames.map((game) => {
            const { S_ORDER, TITEL, UNTERTITEL, INFO, STAENDE, FIRMA_ID } = game;

            const price = INFO.split("price:</td><td>")[1].split("</td>")[0].split("&nbsp;")[0];
            const playercount = INFO.split("players:</td><td>")[1].split("</td>")[0];
            const minplayers = playercount.split("-")[0];
            const maxplayers = playercount.split("-")[1];
            const age = INFO.split("Age:</td><td>")[1].split("and up</td>")[0];
            const booths = STAENDE.map((location) => [location.NAME.slice(0, 1), "-", location.NAME.slice(1)].join(""));
            const designers = INFO.split("</td><td>")[1].split("</td>")[0];
            const playtime = INFO.split("time:</td><td>")[1].split("minutes</td>")[0];
            const releasedate = INFO.split("date:</td><td>")[1].split("</td>")[0];

            return (
              <tr key={FIRMA_ID + S_ORDER}>
                <td>{TITEL}</td>
                <td>{UNTERTITEL}</td>
                <td>{price}</td>
                <td>{releasedate}</td>
                <td>{designers}</td>
                <td>{minplayers + (maxplayers ? `– ${maxplayers}` : "")}</td>
                <td>{playtime}</td>
                <td>{age}</td>
                <td>{booths.map((booth, idx) => booth + (booths.length - 1 !== idx ? ", " : ""))}</td>
              </tr>
            );
          })}
        </thead>
      </table>
    </div>
  );
}
