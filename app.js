// Importiere notwendige Module
import mysql from "mysql2/promise";
import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import dotenv from "dotenv";

// Importiere benutzerdefinierte Funktionen aus database.js
import {
  getNotes,
  createNote,
  updateNote,
  getUsers,
  validateUserCredentials,
} from "./database/database.js";

// Importiere readFile Funktion aus fs/promises Modul
import { readFile } from "fs/promises";

// Lade Umgebungsvariablen aus .env-Datei
dotenv.config();

// Erstelle eine Express-Anwendung
const app = express();

// Setze den Port, auf dem die Anwendung lauschen soll
const PORT = 8080;

// Definiere die MySQL-Datenbankkonfiguration mit Umgebungsvariablen
const DB_CONFIG = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
};

app.set("view engine", "ejs");

// Set up express-session
app.use(
  session({
    secret: "security",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 * 60 * 24 },
  })
);

// Set up body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Funktion zum Ausführen einer SQL-Datei mit der angegebenen MySQL-Verbindung
async function executeSQLFile(filePath, connection) {
  try {
    // Lese die SQL-Datei und teile die Anweisungen auf
    const sql = await readFile(filePath, "utf-8");
    const statements = sql
      .split(";")
      .map((statement) => statement.trim())
      .filter((statement) => statement.length);

    console.log("✅\tStarting to populate the database...");
    // Führe jede SQL-Anweisung aus
    for (const statement of statements) {
      await connection.query(statement);
    }

    console.log("✅\tPopulation finished succesfully");
  } catch (err) {
    console.error("❌\tError executing SQL file:", err);
  }
}

// Funktion zum Initialisieren der Datenbank
async function initializeDatabase() {
  try {
    // Stelle eine Verbindung zur MySQL-Datenbank her
    const connection = await mysql.createConnection(DB_CONFIG);
    console.log("✅\tConnected to database");

    // Führe die schema.sql-Datei aus
    await executeSQLFile("./database/schema.sql", connection);

    // Beende die Verbindung zur Datenbank
    connection.end();
  } catch (err) {
    console.error("❌\tError connecting to MySQL database:", err);
  }
}

// Routen für die Express-Anwendung
app.get("/notes", async (req, res) => {
  const notes = await getNotes();
  res.send(notes);
});

app.get("/", (req, res) => {
  res.render("homepage");
});

app.get("/users", async (req, res) => {
  const users = await getUsers();
  res.send(users);
});

// Initialisiere die Datenbank und starte den Server
initializeDatabase()
  .then(() => {
    app.listen(PORT, (error) => {
      if (!error) {
        console.log("✅\tServer is running and listening on port " + PORT);
      } else {
        console.log("❌\tError occurred, server can't start", error);
      }
    });
  })
  .catch((err) => {
    console.error("❌\tFailed to initialize database:", err);
  });

// Basic authentication middleware
const basicAuth = (req, res, next) => {
  if (req.session.userId) {
    next();
  } else {
    res.status(401).send("Access denied: Please log in");
  }
};

// Login GET route handler
app.get("/login", (req, res) => {
  res.render("login");
});

// Login POST route handler
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the provided username and password are valid
    const user = await validateUserCredentials(username, password);

    if (user) {
      // Set the session data
      req.session.userId = user.user_id;
      req.session.username = user.username;

      // Redirect to user's dashboard
      res.render("dashboard");
    } else {
      // Authentication failed
      res.status(401).send("Invalid username or password");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error occurred during login");
  }
});

// Dashboard route handler
app.get("/dashboard", basicAuth, (req, res) => {
  res.render("dashboard");
});

// Logout route handler
app.get("/logout", (req, res) => {
  // Destroy the session
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: "Error occurred during logout" });
    } else {
      res.redirect("/");
    }
  });
});
