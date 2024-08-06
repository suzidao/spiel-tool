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
export async function getGameDesigners(id: number) {
  const joints = await pool.query(`SELECT designerid FROM designer_game WHERE gameid=${id}`).then((res) => res.rows);
  const designers = joints.map((joint) => {
    return getDesigner(joint.designerid);
  });
  return designers;
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
export async function getDesigner(id: number) {
  return await pool.query(`SELECT * FROM designers WHERE designerid=${id}`).then((res) => res.rows[0]);
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
    minplayers,
    maxplayers,
    minplaytime,
    maxplaytime,
    complexity,
    minage,
    yearpublished,
  } = input;

  const query = `INSERT INTO games (
    bggid,
    previewid,
    title,
    publisher,
    minplayers,
    maxplayers,
    minplaytime,
    maxplaytime,
    complexity,
    minage,
    yearpublished
  ) VALUES (
    ${bggid},
    ${previewid},
    $$${title}$$,
    ${publisher},
    ${minplayers},
    ${maxplayers},
    ${minplaytime},
    ${maxplaytime},
    ${complexity},
    ${minage},
    ${yearpublished}
  ) RETURNING *`;

  return await pool
    .query(query)
    .then((res) => res)
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
    .then((res) => res)
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
    .then((res) => res.rows[0].designerid)
    .catch((error) => console.error(error));
}

export async function createDesignerGame(input: DesignerGameInput) {
  const { gameid, designerid } = input;

  return await pool
    .query(
      `INSERT INTO designer_game (
        gameid,
        designerid
      ) VALUES (
        ${gameid},
        ${designerid}
      ) RETURNING *`
    )
    .then((res) => res)
    .catch((error) => console.error(error));
}
