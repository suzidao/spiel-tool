/** @format */

import { pool } from "../data/db";

export async function getUsers() {
  return await pool.query(`SELECT * FROM users`).then((res) => res.rows);
}
export async function getGames() {
  return await pool.query(`SELECT * FROM games`).then((res) => res.rows);
}
export async function getPublishers() {
  return await pool.query(`SELECT * FROM publishers`).then((res) => res.rows);
}
export async function getDesigners() {
  return await pool.query(`SELECT * FROM designers`).then((res) => res.rows);
}
export async function getAllGameDesigners() {
  return await pool.query(`SELECT * FROM game_designer`).then((res) => res.rows);
}

export async function getUser(id: number) {
  return await pool.query(`SELECT * FROM users WHERE userid=${id}`).then((res) => res.rows[0]);
}
export async function getGame(id: number) {
  return await pool.query(`SELECT * FROM games WHERE gameid=${id}`).then((res) => res.rows[0]);
}
export async function getPublisher(id: number) {
  return await pool.query(`SELECT * FROM publishers WHERE publisherid=${id}`).then((res) => res.rows[0]);
}
export async function getGamePublisher(id: number) {
  return await pool
    .query(
      `SELECT games.publisher, publishers.* FROM games JOIN publishers ON games.publisher=publishers.publisherid WHERE gameid=${id}`
    )
    .then((res) => res.rows[0]);
}
export async function getDesigner(id: number) {
  return await pool.query(`SELECT * FROM designers WHERE designerid=${id}`).then((res) => res.rows[0]);
}
export async function getGameDesigners(id: number) {
  const designerList = await pool.query(`SELECT designers FROM games WHERE gameid=${id}`).then((res) => res.rows);
  const designers = designerList[0].designers.map((id: number) => getDesigner(id));
  return designers;
}

export async function createUser(input: UserInput) {
  const { username, password, email } = input;

  return await pool.query(
    `INSERT INTO users (username, password, email) VALUES ('${username}', '${password}', '${email}') RETURNING userid`
  );
}

export async function createGame(input: GameInput) {
  const {
    bggid,
    previewid,
    title,
    publisher,
    designers,
    minplayers,
    maxplayers,
    minplaytime,
    maxplaytime,
    complexity,
    minage,
    location,
    yearpublished,
    decision,
    negotiation,
    acquisition,
    numhave,
    numneed,
    numpromise,
  } = input;

  const query = `INSERT INTO games (
    bggid,
    previewid,
    title,
    publisher,
    designers,
    minplayers,
    maxplayers,
    minplaytime,
    maxplaytime,
    complexity,
    minage,
    location,
    yearpublished,
    decision,
    negotiation,
    acquisition,
    numhave,
    numneed,
    numpromise
  ) VALUES (
    ${bggid ?? null},
    ${previewid ?? null},
    $$${title}$$,
    ${publisher},
    '{${designers}}',
    ${minplayers ?? null},
    ${maxplayers ?? null},
    ${minplaytime ?? null},
    ${maxplaytime ?? null},
    ${complexity ?? null},
    ${minage ?? null},
    '${location ?? "–"}',
    ${yearpublished ?? null},
    '${decision}',
    '${negotiation}',
    '${acquisition}',
    ${numhave ?? null},
    ${numneed ?? null},
    ${numpromise ?? null}
  ) RETURNING *`;

  return await pool
    .query(query)
    .then((res) => res.rows[0])
    .catch((error) => console.error(error));
}

export async function createPublisher(input: PublisherInput) {
  const { bggid, name, country, contacts } = input;

  return await pool
    .query(
      `INSERT INTO publishers (
        bggid,
        name,
        country,
        contacts
      ) VALUES (
        ${bggid},
        $$${name}$$,
        '${country}',
        '${contacts}'
      ) RETURNING *
    `
    )
    .then((res) => res.rows[0])
    .catch((error) => console.error(error));
}

export async function createDesigner(input: DesignerInput) {
  const { bggid, name } = input;

  return await pool
    .query(
      `INSERT INTO designers (
        bggid,
        name
      ) VALUES (
        ${bggid},
        $$${name}$$
      ) RETURNING *
    `
    )
    .then((res) => res.rows[0])
    .catch((error) => console.error(error));
}

export async function createGameDesigner(input: GameDesignerInput) {
  const { gameid, designerid } = input;

  return await pool
    .query(
      `INSERT INTO game_designer (
        gameid,
        designerid
      ) VALUES (
        ${gameid},
        ${designerid}
      ) RETURNING *`
    )
    .then((res) => res.rows[0])
    .catch((error) => console.error(error));
}

export async function updateGame(gameid: number, input: GameInput) {
  const {
    title,
    publisher,
    designers,
    minplayers,
    maxplayers,
    minplaytime,
    maxplaytime,
    complexity,
    minage,
    location,
    yearpublished,
  } = input;

  return await pool
    .query(
      `UPDATE games SET
        title=$$${title}$$,
        publisher=${publisher},
        designers='{${designers}}',
        minplayers=${minplayers},
        maxplayers=${maxplayers},
        minplaytime=${minplaytime},
        maxplaytime=${maxplaytime},
        complexity=${complexity},
        minage=${minage},
        location='${location}',
        yearpublished=${yearpublished}
      WHERE gameid=${gameid}
      RETURNING *`
    )
    .then((res) => res.rows[0])
    .catch((error) => console.error(error));
}

export async function updatePublisher(publisherid: number, input: PublisherInput) {
  const { bggid, name, country, contacts } = input;

  return await pool
    .query(
      `UPDATE publishers SET
        bggid=${bggid},
        name=$$${name}$$,
        country='${country}',
        contacts='${contacts}'
      WHERE publisherid=${publisherid}
      RETURNING *
    `
    )
    .then((res) => res.rows[0])
    .catch((error) => console.error(error));
}

export async function updateDesigner(designerid: number, input: DesignerInput) {
  const { bggid, name } = input;

  return await pool
    .query(
      `UPDATE designers SET
        bggid=${bggid},
        name=$$${name}$$
      WHERE designerid=${designerid}
      RETURNING *
    `
    )
    .then((res) => res.rows[0])
    .catch((error) => console.error(error));
}

export async function deleteGame(gameid: number) {
  return await pool.query(`DELETE from games WHERE gameid=${gameid} RETURNING gameid`);
}
export async function deletePublisher(publisherid: number) {
  return await pool.query(`DELETE from publishers WHERE publisherid=${publisherid} RETURNING publisherid`);
}
export async function deleteDesigner(designerid: number) {
  return await pool.query(`DELETE from designers WHERE designerid=${designerid} RETURNING designerid`);
}
