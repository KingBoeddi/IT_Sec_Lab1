// Importiere notwendige Module
import mysql from "mysql2/promise";
import dotenv from "dotenv";

// Lade Umgebungsvariablen aus .env-Datei
dotenv.config();

// Definiere die MySQL-Datenbankkonfiguration mit Umgebungsvariablen
export const pool = mysql.createPool({
  host: process.env.WEBAPP_SERVICE_DB_LOCAL,
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

/* A01:2021 – Injection (SQL-Injektion) 
Die validateUserCredentials-Funktion in der zweiten Datei ist anfällig für SQL-Injektionsangriffe, 
da der Benutzername und das Passwort ohne ordnungsgemäße Bereinigung oder Parametrisierung direkt 
in die SQL-Abfrage eingefügt werden*/
export async function validateUserCredentials(username, password) {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM User WHERE username = '${username}' AND password = '${password}'`
    );

    //  Injection vermeiden:
    /* const [rows] = await pool.execute(
      `SELECT * FROM User WHERE username = ? AND password = ?`,
      [username, password]
    ); */

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

/* A03:2021 – Sensitive Data Exposure (Offenlegung sensibler Daten) - getUsers()

Die getUsers-Funktion in der zweiten Datei ruft alle Benutzerdaten, 
einschließlich Passwörtern, aus der Datenbank ab. Dies kann zu einer 
Offenlegung sensibler Daten führen, wenn die Funktion missbraucht wird 
oder ein Angreifer Zugang zu den zurückgegebenen Daten erhält. */
export async function getUsers() {
  const [rows] = await pool.query(`SELECT * FROM User`);
  return rows;
}

/* A02:2021 – Cryptographic Failures (Kryptografische Fehler) 

Das Speichern von Passwörtern im Klartext, wie es in der createUser-Funktion 
in der zweiten Datei gemacht wird, ist nicht sicher
Um Passwörter sicher zu speichern, verwenden Sie eine starke Passwort-Hashing-Bibliothek
 wie bcrypt, um das Passwort zu hashen, bevor Sie es in der Datenbank speichern.
Dazu muss auch die validateUserCredentials-Funktion aktualisiert werden, um das gehashte 
Passwort in der Datenbank mit dem angegebenen Passwort zu vergleichen. */

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

//  Löscht eine Notiz in der Datenbank
export async function deleteNote(noteId) {
  try {
    const [result] = await pool.query(`DELETE FROM Note WHERE note_id = ?`, [
      noteId,
    ]);
    return result;
  } catch (error) {
    console.error("Error occurred while deleting note:", error);
    throw error;
  }
}
