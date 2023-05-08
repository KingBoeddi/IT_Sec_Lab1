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

/* OWASP Top 10: A2:2021 Broken Authentication
any password will be accepted for a given username. This can be exploited by an 
attacker to log in as any user without knowing the user's password. */
export async function weakAuthenticate(username) {
  const users = await getUsers();
  try {
    return users.find((user) => user.username === username);
  } catch (error) {
    console.err(error);
  }
}

// Funktion zur Überprüfung der Benutzeranmeldeinformationen gegen die Datenbank (sichere Variante)
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

// Funktion zum Abrufen aller Notizen aus der Datenbank
export async function getNotes() {
  const [rows] = await pool.query(`SELECT * FROM Note`);
  return rows;
}

// Funktion zum Abrufen aller Benutzer aus der Datenbank
export async function getUsers() {
  const [rows] = await pool.query(`SELECT * FROM User`);
  return rows;
}

// Funktion zum Registrieren eines neuen Benutzers in der Datenbank
export async function createUser(username, password) {
  try {
    const [result] = await pool.query(
      `INSERT INTO User (username, password) VALUES ('${username}', '${password}')`
    );
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Funktion zum Abrufen von Notizen eines bestimmten Benutzers aus der Datenbank
export async function getUserNotes(user_id) {
  const [rows] = await pool.query(
    `SELECT * FROM Note WHERE user_id = ${user_id}`
  );
  return rows;
}

// Funktion zum Abrufen einer bestimmten Notiz anhand der Notiz- und Benutzer-ID aus der Datenbank
export async function fetchNoteById(noteId, userId) {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM Note WHERE note_id = ${noteId} AND user_id = ${userId}`
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

/* Funktion zum Erstellen einer neuen Notiz in der Datenbank unter Verwendung von vorbereiteten Anweisungen 
(sicherer gegen SQL-Injection-Angriffe) */
export async function createNote(user_id, title, content) {
  try {
    const sql = "INSERT INTO Note (user_id, title, content) VALUES (?, ?, ?)";
    const values = [user_id, title, content];

    const [result] = await pool.execute(sql, values);
    return result;
  } catch (err) {
    console.error("Error creating note:", err);
  }
}

// Funktion zum Aktualisieren einer bestehenden Notiz in der Datenbank
export async function updateNote(noteId, title, content) {
  /* const escapedTitle = mysql.escape(title);
  const escapedContent = mysql.escape(content); */
  const [result] = await pool.query(
    `UPDATE Note SET title = '${title}', content = '${content}' WHERE note_id = ${noteId}`
  );
  return result;
}
