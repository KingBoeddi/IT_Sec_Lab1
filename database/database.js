// Importiere notwendige Module
import mysql from "mysql2/promise";
import dotenv from "dotenv";

// Lade Umgebungsvariablen aus .env-Datei
dotenv.config();

// Definiere die MySQL-Datenbankkonfiguration mit Umgebungsvariablen
export const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

export async function validateUserCredentials(username, password) {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM User WHERE username = '${username}' AND password = '${password}'`
    );
    if (rows.length > 0) {
      return rows[0];
    } else {
      return null;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getNotes() {
  const [rows] = await pool.query(`SELECT * FROM Note`);
  return rows;
}

export async function getUsers() {
  const [rows] = await pool.query(`SELECT * FROM User`);
  return rows;
}

export async function getNote(id) {
  const [rows] = await pool.query(`SELECT * FROM Note WHERE id = ${id}`);
  return rows;
}

export async function createNote(id, title, content) {
  const [result] = await pool.query(
    `INSERT INTO Note (id, title, content) VALUES (${id}, ${title}, ${content})`
  );
  return result;
}

export async function updateNote(id, title, content) {
  const [result] = await pool.query(
    `UPDATE Note SET title = '${title}', content = '${content}' WHERE id = ${id}`
  );
  return result;
}
